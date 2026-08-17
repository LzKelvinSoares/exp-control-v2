import { Currency } from "@/types/app-types"

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatCurrency(value: number, currency: Currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
}

export function toDateInput(date?: Date | string) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export function toGmtRange(initDate: Date, endDate: Date) {
  const start = new Date(initDate)
  start.setDate(start.getDate() - 1)
  start.setHours(20, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(19, 59, 59, 999)

  return { start, end }
};
