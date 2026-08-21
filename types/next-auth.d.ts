import type { Currency } from '@/types'
import type { PageKey } from '@/types/app-types/auth'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      currencyAccounts: Currency[]
      currentCurrency: Currency
      points: number
      access?: PageKey[]
    }
  }

  interface User {
    id: string
    currencyAccounts: Currency[]
    currentCurrency: Currency
    points: number
    access: PageKey[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    currencyAccounts: Currency[]
    currentCurrency: Currency
    points: number
    access: PageKey[]
  }
}
