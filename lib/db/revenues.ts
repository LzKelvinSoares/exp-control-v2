import RevenueModel from '@/models/Revenue'
import { findMany, createMany, updateOne, deleteOne } from './crud'
import type { Revenue } from '@/types'

export function getRevenues(userId: string, currency: string, month: number, year: number) {
  const start = new Date(year, month - 1, 1).toISOString()
  const end = new Date(year, month, 1).toISOString()
  return findMany(RevenueModel, {
    userId,
    currencyCurrencyAccount: currency,
    firstExpirationDate: { $gte: start, $lt: end },
  })
}

export function getRevenuesByYear(userId: string, currency: string, year: number) {
  const start = new Date(year, 0, 1).toISOString()
  const end = new Date(year + 1, 0, 1).toISOString()
  return findMany(RevenueModel, {
    userId,
    currencyCurrencyAccount: currency,
    firstExpirationDate: { $gte: start, $lt: end },
  })
}

export async function createRevenue(data: Omit<Revenue, 'id' | 'creationDate'>): Promise<Revenue[]> {
  const { monthsLeft = 1, ...rest } = data
  const baseDate = new Date(rest.firstExpirationDate as string)

  const records: Partial<Revenue>[] = Array.from({ length: monthsLeft }, (_, i) => {
    const expDate = new Date(baseDate)
    expDate.setMonth(expDate.getMonth() + i)
    return { ...rest, firstExpirationDate: expDate.toISOString(), monthsLeft }
  })

  if (records.length > 1) {
    const [parent, ...children] = await createMany(RevenueModel, records)
    const parentId = parent.id!
    await Promise.all(
      children.map((c) =>
        updateOne(RevenueModel, c.id!, { parentBudgetId: parentId })
      )
    )
    return [parent, ...children] as Revenue[]
  }

  return createMany(RevenueModel, records)
}

export function updateRevenue(id: string, data: Partial<Revenue>) {
  return updateOne(RevenueModel, id, data)
}

export function deleteRevenue(id: string) {
  return deleteOne(RevenueModel, id)
}
