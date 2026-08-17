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
