import { PageKey } from './auth'

export interface DataItem {
  date: string
  description: string
  amount: string
}

export interface CategoryOption<T extends string> {
  value: T
  label: string
}

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  access?: PageKey
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
