import RevenueModel from '@/models/Revenue'
import { findMany, createMany, updateOne, deleteOne } from './crud'
import type { Revenue } from '@/types'

export function getRevenues(userId: string, currency: string, month: number, year: number) {
  return findMany(RevenueModel, { userId, currency, month, year })
}

export function getRevenuesByYear(userId: string, currency: string, year: number) {
  return findMany(RevenueModel, { userId, currency, year })
}

export async function createRevenue(data: Omit<Revenue, '_id' | 'createdAt'>): Promise<Revenue[]> {
  const { installments = 1, ...rest } = data

  const records: Partial<Revenue>[] = Array.from({ length: installments }, (_, i) => {
    const month = ((rest.month - 1 + i) % 12) + 1
    const year = rest.year + Math.floor((rest.month - 1 + i) / 12)
    return { ...rest, month, year, installments }
  })

  if (records.length > 1) {
    const [parent, ...children] = await createMany(RevenueModel, records)
    const parentId = (parent as Revenue & { _id: string })._id.toString()
    await Promise.all(
      children.map((c) =>
        updateOne(RevenueModel, (c as Revenue & { _id: string })._id.toString(), {
          parentRevenueId: parentId,
        })
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
