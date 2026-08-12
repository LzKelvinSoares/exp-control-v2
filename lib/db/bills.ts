import BillModel from '@/models/Bill'
import { findMany, createOne, updateOne, updateMany, deleteOne } from './crud'
import type { Bill } from '@/types'

export function getBills(userId: string, currency: string) {
  return findMany(BillModel, { userId, currencyCurrencyAccount: currency })
}

function toGmtRange(initDate: Date, endDate: Date) {
  const start = new Date(initDate)
  start.setDate(start.getDate() - 1)
  start.setHours(20, 0, 0, 0)

  const end = new Date(endDate)
  end.setHours(19, 59, 59, 999)

  return { start, end }
}

export function getBillsDueSoon(userId: string, currency: string, withinDays = 5) {
  const initDate = new Date()
  initDate.setHours(0, 0, 0, 0)
  const endDate = new Date()
  endDate.setDate(initDate.getDate() + withinDays)
  const { start, end } = toGmtRange(initDate, endDate)
  return findMany(BillModel, {
    userId,
    currencyCurrencyAccount: currency,
    paid: false,
    expirationDate: { $gte: start.toISOString(), $lte: end.toISOString() },
  })
}

export function createBill(data: Omit<Bill, 'id' | 'creationDate'>) {
  return createOne(BillModel, data)
}

export function updateBill(id: string, data: Partial<Bill>) {
  return updateOne(BillModel, id, data)
}

export function payBill(id: string) {
  return updateOne(BillModel, id, { paid: true, paidAt: new Date() })
}

export function payBills(ids: string[]) {
  return updateMany(BillModel, { id: { $in: ids } }, { paid: true, paidAt: new Date() })
}

export function deleteBill(id: string) {
  return deleteOne(BillModel, id)
}
