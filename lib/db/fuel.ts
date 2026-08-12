import FuelModel from '@/models/Fuel'
import { findMany, createOne, updateOne, deleteOne } from './crud'
import type { Fuel } from '@/types'

export function getFuelEntries(userId: string, currency: string, month: number, year: number) {
  const start = new Date(year, month - 1, 1).toISOString()
  const end = new Date(year, month, 1).toISOString()
  return findMany(FuelModel, { userId, currencyCurrencyAccount: currency, creationDate: { $gte: start, $lt: end } })
}

export function getFuelByYear(userId: string, currency: string, year: number) {
  const start = new Date(year, 0, 1).toISOString()
  const end = new Date(year + 1, 0, 1).toISOString()
  return findMany(FuelModel, { userId, currencyCurrencyAccount: currency, creationDate: { $gte: start, $lt: end } })
}

export function createFuelEntry(data: Omit<Fuel, 'id'>) {
  return createOne(FuelModel, data)
}

export function updateFuelEntry(id: string, data: Partial<Fuel>) {
  return updateOne(FuelModel, id, data)
}

export function deleteFuelEntry(id: string) {
  return deleteOne(FuelModel, id)
}
