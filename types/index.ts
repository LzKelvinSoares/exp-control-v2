import type React from 'react'

export type Currency = 'BRL' | 'EUR'

export interface CurrencyAccount {
  currency: Currency
  label: string
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface UserSession {
  id: string
  name: string
  email: string
  currencyAccounts: CurrencyAccount[]
  currentCurrency: Currency
  points: number
}

// ── Expense / Revenue ────────────────────────────────────────────────────────

export type ExpenseCategory =
  | 'CARTAO'
  | 'COMPRAS'
  | 'COMPRAS_AVULSAS'
  | 'ENERGIA'
  | 'AGUA'
  | 'GAS'
  | 'INTERNET'
  | 'TELEFONE'
  | 'ALUGUEL'
  | 'COMBUSTIVEL'
  | 'RESTAURANTE'
  | 'OUTROS'

export type RevenueCategory = 'SALARIO' | 'FREELANCE' | 'INVESTIMENTO' | 'EMPRESTIMO' | 'OUTROS'

export interface MarketShoppingItem {
  id?: string
  description: string
  quantity: number
  unit: string
  value: number
  valuePerUnit: number
}

export interface Expense {
  id?: string
  userId: string
  currencyCurrencyAccount: string
  description: string
  type: string
  typeDescription?: string
  responsible?: string
  value: number
  firstExpirationDate: Date | string
  monthsLeft?: number
  parentBudgetId?: string
  marketItems?: MarketShoppingItem[]
  creationDate?: Date
}

export interface Revenue {
  id?: string
  userId: string
  currencyCurrencyAccount: string
  description: string
  type: string
  typeDescription?: string
  responsible?: string
  value: number
  firstExpirationDate: Date | string
  monthsLeft?: number
  parentBudgetId?: string
  creationDate?: Date
}

// ── Bills ────────────────────────────────────────────────────────────────────

export type BillCategory = 'ENERGIA' | 'AGUA' | 'GAS' | 'INTERNET' | 'TELEFONE' | 'ALUGUEL' | 'CARTAO' | 'UTILIDADES' | 'OUTROS'

export interface Bill {
  id?: string
  userId: string
  currencyCurrencyAccount: string
  description: string
  type: string
  typeDescription?: string
  responsible?: string
  value: number
  expirationDate: Date | string
  barCode?: string
  paid: boolean
  paidAt?: Date | string
  creationDate?: Date
}

// ── Fuel ─────────────────────────────────────────────────────────────────────

export interface Fuel {
  id?: string
  userId: string
  currencyCurrencyAccount: string
  creationDate: string
  value: number
  valuePerLiter: number
}

// ── Sales ─────────────────────────────────────────────────────────────────────

export type SaleRoom = 'SALA' | 'QUARTO' | 'COZINHA' | 'BANHEIRO' | 'ESCRITORIO' | 'ROOFTOP' | 'OUTRO'

export interface Sale {
  id?: string
  description: string
  room: SaleRoom
  roomDescription?: string
  buyer?: string
  value: number
  valuePaid?: string | number
  discount?: string | number
  installments?: number
  bookingDate?: Date | string
  saleDate?: Date | string
  paid: boolean
  delivered: boolean
  tieIn?: boolean
  tiedInItem?: string
  tiedInItemValue?: string | number
  boughtTogether?: boolean
  imgId?: string | null
  creationDate?: Date | string
}

// ── User Levels ───────────────────────────────────────────────────────────────

export interface UserLevel {
  level: number
  label: string
  minPoints: number
  maxPoints: number
}

// ── Shared option shapes (used by constants/) ─────────────────────────────────

export interface CategoryOption<T extends string> {
  value: T
  label: string
}

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export interface UnitOption {
  value: string
  label: string
}

export interface MonthOption {
  value: number
  label: string
  short: string
}

// ── Chart ─────────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface MonthlyChartData {
  month: string
  expenses: number
  revenues: number
  fuel: number
}
