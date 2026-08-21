import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from '@/lib/mongodb'
import UserModel, { type IUser } from '@/models/User'
import bcrypt from 'bcryptjs'
import { authConfig } from '@/auth.config'
import { Currency } from '@/types/app-types'
import { type PageKey } from '@/types/app-types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()
        const user = await UserModel.findOne({ email: credentials.email })
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          currencyAccounts: user.currencyAccounts,
          currentCurrency: user.currentCurrency,
          points: user.points,
          access: user.access,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session?.currentCurrency) {
        token.currentCurrency = session.currentCurrency
      }
      if (user) {
        if (account?.provider === 'google') {
          await connectDB()
          const dbUser = await UserModel.findOne({ email: user.email }).lean<IUser>()
          token.id = dbUser?.id.toString() ?? ''
          token.currencyAccounts = dbUser?.currencyAccounts ?? []
          token.currentCurrency = dbUser?.currentCurrency ?? 'BRL'
          token.points = dbUser?.points ?? 0
          token.access = (dbUser?.access ?? []).map(a => a.toLowerCase()) as PageKey[]
        } else {
          token.id = user.id
          token.currencyAccounts = user.currencyAccounts
          token.currentCurrency = user.currentCurrency
          token.points = user.points
          token.access = (user.access ?? []).map(a => a.toLowerCase()) as PageKey[]
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.currencyAccounts = token.currencyAccounts as Currency[]
      session.user.currentCurrency = token.currentCurrency as Currency
      session.user.points = token.points as number
      session.user.access = token.access as PageKey[]
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        const existing = await UserModel.findOne({ email: user.email })
        if (!existing) {
          await UserModel.create({
            name: user.name,
            email: user.email,
            password: '',
            currencyAccounts: [{ currency: 'BRL', label: 'Real' }],
            currentCurrency: 'BRL',
            points: 0,
            googleRefreshToken: account.refresh_token ?? '',
            access: user.access
          })
        } else if (account.refresh_token) {
          await UserModel.findOneAndUpdate(
            { email: user.email },
            { googleRefreshToken: account.refresh_token },
          )
        }
      }
      return true
    },
  },
})
