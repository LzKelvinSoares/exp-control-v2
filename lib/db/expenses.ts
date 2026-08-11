import ExpenseModel from '@/models/Expense'
import { findMany, createMany, updateOne, deleteOne } from './crud'
import type { Expense } from '@/types'

export function getExpenses(userId: string, currency: string, month: number, year: number) {
  return findMany(ExpenseModel, { userId, currency, month, year })
}

export function getExpensesByYear(userId: string, currency: string, year: number) {
  return findMany(ExpenseModel, { userId, currency, year })
}

export async function createExpense(data: Omit<Expense, '_id' | 'createdAt'>): Promise<Expense[]> {
  const { installments = 1, ...rest } = data

  const records: Partial<Expense>[] = Array.from({ length: installments }, (_, i) => {
    const month = ((rest.month - 1 + i) % 12) + 1
    const year = rest.year + Math.floor((rest.month - 1 + i) / 12)
    return { ...rest, month, year, installments }
  })

  if (records.length > 1) {
    const [parent, ...children] = await createMany(ExpenseModel, records)
    const parentId = (parent as Expense & { _id: string })._id.toString()
    await Promise.all(
      children.map((c) =>
        updateOne(ExpenseModel, (c as Expense & { _id: string })._id.toString(), {
          parentExpenseId: parentId,
        })
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
