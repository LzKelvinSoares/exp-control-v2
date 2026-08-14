'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/constants'
import LevelProgress from '@/components/shared/LevelProgress'
import { useSidebar } from '@/store/sidebar'

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close, isCollapsed, toggleCollapsed } = useSidebar()

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
          'fixed inset-y-0 left-0 z-30 flex flex-col text-white overflow-hidden transition-[width,transform] duration-100 ease-out md:static md:translate-x-0 md:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-16' : 'w-64',
        )}
      >
        <div
          className={cn('h-14 flex items-center shrink-0', isCollapsed ? 'justify-center px-2' : 'px-6 justify-between')}
          style={{ borderBottom: '1px solid #612d60' }}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-blank.png" alt="ExpControl" className="h-8 w-8 object-contain shrink-0" />
            {!isCollapsed && <span className="text-xl font-bold tracking-tight whitespace-nowrap">ExpControl</span>}
          </div>
          {!isCollapsed && (
            <button onClick={toggleCollapsed} className="text-purple-200 hover:text-white shrink-0 ml-1">
              <ChevronLeft size={16} />
            </button>
          )}
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
                isCollapsed && 'justify-center px-0',
                pathname === href ? 'text-white' : 'text-purple-200 hover:text-white',
              )}
              onMouseEnter={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(97,45,96,0.6)' }}
              onMouseLeave={e => { if (pathname !== href) (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && label}
            </Link>
          ))}
        </nav>

        {!isCollapsed && <LevelProgress />}

        <div className="px-3 py-4 space-y-1">
          {isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="w-full flex justify-center py-2 text-purple-200 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          )}
          <Button
            variant="ghost"
            className={cn(
              'w-full text-purple-200 hover:text-white',
              isCollapsed ? 'justify-center px-0' : 'justify-start gap-3',
            )}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(97,45,96,0.6)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && 'Sair'}
          </Button>
        </div>
      </aside>
    </>
  )
}
