import ExpenseModel from '@/models/Expense'
import { findMany, createMany, updateOne, deleteOne } from './crud'
import type { Expense } from '@/types'

export function getExpenses(userId: string, currency: string, month: number, year: number) {
  const start = new Date(year, month - 1, 1).toISOString()
  const end = new Date(year, month, 1).toISOString()
  return findMany(ExpenseModel, {
    userId,
    currencyCurrencyAccount: currency,
    firstExpirationDate: { $gte: start, $lt: end },
  })
}

export function getExpensesByYear(userId: string, currency: string, year: number) {
  const start = new Date(year, 0, 1).toISOString()
  const end = new Date(year + 1, 0, 1).toISOString()
  return findMany(ExpenseModel, {
    userId,
    currencyCurrencyAccount: currency,
    firstExpirationDate: { $gte: start, $lt: end },
  })
}

export async function createExpense(data: Omit<Expense, 'id' | 'creationDate'>): Promise<Expense[]> {
  const { monthsLeft = 1, ...rest } = data
  const baseDate = new Date(rest.firstExpirationDate as string)

  const records: Partial<Expense>[] = Array.from({ length: monthsLeft }, (_, i) => {
    const expDate = new Date(baseDate)
    expDate.setMonth(expDate.getMonth() + i)
    return { ...rest, firstExpirationDate: expDate.toISOString(), monthsLeft }
  })

  if (records.length > 1) {
    const [parent, ...children] = await createMany(ExpenseModel, records)
    const parentId = parent.id!
    await Promise.all(
      children.map((c) =>
        updateOne(ExpenseModel, c.id!, { parentBudgetId: parentId })
      )
    )
    return [parent, ...children] as Expense[]
  }

  return createMany(ExpenseModel, records)
}

export function updateExpense(id: string, data: Partial<Expense>) {
  return updateOne(ExpenseModel, id, data)
}

export function deleteExpense(id: string) {
  return deleteOne(ExpenseModel, id)
}
