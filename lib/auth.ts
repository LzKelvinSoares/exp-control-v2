import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from '@/lib/mongodb'
import UserModel from '@/models/User'
import bcrypt from 'bcryptjs'
import { authConfig } from '@/auth.config'
import type { Currency } from '@/types'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          const dbUser = await UserModel.findOne({ email: user.email }).lean()
          token.id = (dbUser as any)?.id.toString()
          token.currencyAccounts = (dbUser as any)?.currencyAccounts
          token.currentCurrency = (dbUser as any)?.currentCurrency as Currency
          token.points = (dbUser as any)?.points
        } else {
          token.id = user.id
          token.currencyAccounts = (user as any).currencyAccounts
          token.currentCurrency = (user as any).currentCurrency as Currency
          token.points = (user as any).points
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.currencyAccounts = token.currencyAccounts as any
      session.user.currentCurrency = token.currentCurrency as Currency
      session.user.points = token.points as number
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
          })
        }
      }
      return true
    },
  },
})
