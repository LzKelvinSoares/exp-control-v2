import BillModel from '@/models/Bill'
import { findMany, createOne, updateOne, updateMany, deleteOne } from './crud'
import type { Bill } from '@/types'

export function getBills(userId: string, currency: string) {
  return findMany(BillModel, { userId, currency })
}

export function getBillsDueSoon(userId: string, currency: string, withinDays = 5) {
  const now = new Date()
  const limit = new Date()
  limit.setDate(limit.getDate() + withinDays)
  return findMany(BillModel, {
    userId,
    currency,
    paid: false,
    dueDate: { $gte: now, $lte: limit },
  })
}

export function createBill(data: Omit<Bill, '_id' | 'createdAt'>) {
  return createOne(BillModel, data)
}

export function updateBill(id: string, data: Partial<Bill>) {
  return updateOne(BillModel, id, data)
}

export function payBill(id: string) {
  return updateOne(BillModel, id, { paid: true, paidAt: new Date() })
}

export function payBills(ids: string[]) {
  return updateMany(BillModel, { _id: { $in: ids } }, { paid: true, paidAt: new Date() })
}

export function deleteBill(id: string) {
  return deleteOne(BillModel, id)
}
