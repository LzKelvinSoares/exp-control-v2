import type { NextAuthConfig } from 'next-auth'

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
      return true
    },
  },
  providers: [],
}
