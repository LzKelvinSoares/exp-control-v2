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
  | 'PENSAO'
  | 'FARMACIA'
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

export interface Budget {
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

export interface Expense extends Budget {
  marketItems?: MarketShoppingItem[]
}