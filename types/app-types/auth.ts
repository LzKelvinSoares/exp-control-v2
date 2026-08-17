import { Currency, CurrencyAccount } from './currency'

export interface UserSession {
  id: string
  name: string
  email: string
  currencyAccounts: CurrencyAccount[]
  currentCurrency: Currency
  points: number
}

export interface UserLevel {
  level: number
  label: string
  minPoints: number
  maxPoints: number
}