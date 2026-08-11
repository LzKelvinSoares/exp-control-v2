'use client'

import { useSession } from 'next-auth/react'
import { useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { switchCurrency } from '@/lib/actions/currency'
import type { Currency } from '@/types'

export default function Header() {
  const { data: session, update } = useSession()
  const [pending, startTransition] = useTransition()

  const user = session?.user
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

  function handleCurrencySwitch(currency: Currency) {
    startTransition(async () => {
      await switchCurrency(currency)
      await update({ currentCurrency: currency })
    })
  }

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div />

      <div className="flex items-center gap-3">
        {user?.currencyAccounts && user.currencyAccounts.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger disabled={pending} className="cursor-pointer">
              <Badge variant="outline" className="text-xs font-semibold">
                {user.currentCurrency ?? 'BRL'}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.currencyAccounts.map((acc) => (
                <DropdownMenuItem
                  key={acc.currency}
                  onClick={() => handleCurrencySwitch(acc.currency)}
                >
                  {acc.currency} — {acc.label}
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
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {user?.points ?? 0} pontos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
