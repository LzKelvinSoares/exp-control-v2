import type { CurrencyAccount, Currency } from '@/types'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      currencyAccounts: CurrencyAccount[]
      currentCurrency: Currency
      points: number
    }
  }

  interface User {
    id: string
    currencyAccounts: CurrencyAccount[]
    currentCurrency: Currency
    points: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    currencyAccounts: CurrencyAccount[]
    currentCurrency: Currency
    points: number
  }
}
