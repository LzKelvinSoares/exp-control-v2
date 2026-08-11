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
  | 'ENERGIA'
  | 'AGUA'
  | 'GAS'
  | 'INTERNET'
  | 'TELEFONE'
  | 'ALUGUEL'
  | 'COMBUSTIVEL'
  | 'OUTROS'

export type RevenueCategory = 'SALARIO' | 'FREELANCE' | 'INVESTIMENTO' | 'EMPRESTIMO' | 'OUTROS'

export interface MarketShoppingItem {
  _id?: string
  description: string
  quantity: number
  unit: string
  value: number
  valuePerUnit: number
}

export interface Expense {
  _id?: string
  userId: string
  currency: Currency
  description: string
  category: ExpenseCategory
  responsible: string
  value: number
  month: number
  year: number
  installments?: number
  parentExpenseId?: string
  marketItems?: MarketShoppingItem[]
  createdAt?: Date
}

export interface Revenue {
  _id?: string
  userId: string
  currency: Currency
  description: string
  category: RevenueCategory
  responsible: string
  value: number
  month: number
  year: number
  installments?: number
  parentRevenueId?: string
  createdAt?: Date
}

// ── Bills ────────────────────────────────────────────────────────────────────

export type BillCategory = 'ENERGIA' | 'AGUA' | 'GAS' | 'INTERNET' | 'TELEFONE' | 'ALUGUEL' | 'OUTROS'

export interface Bill {
  _id?: string
  userId: string
  currency: Currency
  name: string
  category: BillCategory
  value: number
  dueDate: Date | string
  barcode?: string
  paid: boolean
  paidAt?: Date | string
  createdAt?: Date
}

// ── Fuel ─────────────────────────────────────────────────────────────────────

export interface Fuel {
  _id?: string
  userId: string
  currency: Currency
  date: Date | string
  totalCost: number
  pricePerLiter: number
  liters: number
  createdAt?: Date
}

// ── Sales ─────────────────────────────────────────────────────────────────────

export type SaleRoom = 'SALA' | 'QUARTO' | 'COZINHA' | 'BANHEIRO' | 'OUTROS'
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID'
export type DeliveryStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED'

export interface Sale {
  _id?: string
  name: string
  room: SaleRoom
  buyer?: string
  value: number
  discount?: number
  installments?: number
  bookingDate?: Date | string
  saleDate?: Date | string
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  imageId?: string
  tiedSaleId?: string
  createdAt?: Date
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
