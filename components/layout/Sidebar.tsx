'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/constants'
import LevelProgress from '@/components/shared/LevelProgress'
import { useSidebar } from '@/store/sidebar'

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-slate-900 text-slate-100 transition-transform duration-300 md:static md:translate-x-0 md:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="px-6 py-5 border-b border-slate-700">
          <span className="text-xl font-bold tracking-tight">ExpControl</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <LevelProgress />

        <div className="px-3 py-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </aside>
    </>
  )
}
