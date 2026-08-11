'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/constants'
import LevelProgress from '@/components/shared/LevelProgress'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col h-full w-64 bg-slate-900 text-slate-100">
      <div className="px-6 py-5 border-b border-slate-700">
        <span className="text-xl font-bold tracking-tight">ExpControl</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
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
  )
}
