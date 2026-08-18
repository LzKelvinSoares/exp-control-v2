'use client'

import { useSession } from 'next-auth/react'
import { useTransition } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/store/sidebar'
import { useQueryClient } from '@tanstack/react-query'
import { Currency } from '@/types/app-types'
import { switchCurrency } from '@/lib/actions/services/currency.service'

export default function Header() {
  const { data: session, update } = useSession()
  const [pending, startTransition] = useTransition()
  const { toggle } = useSidebar()
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()

  const user = session?.user
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

  function handleCurrencySwitch(currency: Currency) {
    startTransition(async () => {
      await switchCurrency(currency)
      await update({ currentCurrency: currency })
      queryClient.invalidateQueries()
    })
  }

  return (
    <header className="relative h-14 bg-background flex items-center justify-between px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
        <Menu size={20} />
      </Button>
      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        {user?.currencyAccounts && user.currencyAccounts.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger disabled={pending} className="cursor-pointer">
              <Badge className="text-xs font-semibold text-white" style={{ backgroundColor: '#612d60' }}>
                {user.currentCurrency ?? 'BRL'}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Conta</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {user.currencyAccounts.map((acc) => (
                <DropdownMenuItem
                  key={acc}
                  onClick={() => handleCurrencySwitch(acc)}
                >
                  {acc}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image ?? ''} alt={user?.name ?? ''} />
              <AvatarFallback className="text-xs bg-slate-200">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {user?.points ?? 0} pontos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-border" />
        {pending && (
          <div
            className="absolute h-full w-1/3"
            style={{ backgroundColor: '#612d60', animation: 'slide-progress 1.4s linear infinite' }}
          />
        )}
      </div>
    </header>
  )
}
