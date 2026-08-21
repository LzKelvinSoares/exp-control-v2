import { Currency, CurrencyAccount } from './currency'

export type PageKey = 'sales'

export interface UserSession {
  id: string
  name: string
  email: string
  currencyAccounts: CurrencyAccount[]
  currentCurrency: Currency
  points: number
  access: PageKey[]
}

export interface UserLevel {
  level: number
  label: string
  minPoints: number
  maxPoints: number
}