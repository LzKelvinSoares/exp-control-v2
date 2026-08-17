import { Currency } from "@/types/app-types"

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatCurrency(value: number, currency: Currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
}
