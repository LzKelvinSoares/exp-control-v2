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

      <aside
        style={{ backgroundColor: '#291b2a' }}
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col w-64 text-white transition-transform duration-300 md:static md:translate-x-0 md:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-6 h-14 flex items-center" style={{ borderBottom: '1px solid #612d60' }}>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-blank.png" alt="ExpControl" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight">ExpControl</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              style={pathname === href ? { backgroundColor: '#612d60' } : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'text-white'
                  : 'text-purple-200 hover:text-white',
              )}
              onMouseEnter={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(97,45,96,0.6)' }}
              onMouseLeave={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
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
            className="w-full justify-start gap-3 text-purple-200 hover:text-white"
            style={{}}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(97,45,96,0.6)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
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
