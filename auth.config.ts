import type { NextAuthConfig } from 'next-auth'
import type { PageKey } from '@/types/app-types/auth'

const PAGE_ACCESS_MAP: Record<string, PageKey> = {
  '/sales': 'sales',
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.pathname.startsWith('/login')

      if (!isLoggedIn && !isAuthPage) {
        return Response.redirect(new URL('/login', nextUrl))
      }
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl))
      }

      const requiredAccess = Object.entries(PAGE_ACCESS_MAP).find(
        ([route]) => nextUrl.pathname.startsWith(route)
      )?.[1]

      if (requiredAccess && !auth?.user?.access?.includes(requiredAccess)) {
        return Response.redirect(new URL('/', nextUrl))
      }

      return true
    },
  },
  providers: [],
}
