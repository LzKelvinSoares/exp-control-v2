import FuelModel from '@/models/Fuel'
import { findMany, createOne, updateOne, deleteOne } from './crud'
import type { Fuel } from '@/types'

export function getFuelEntries(userId: string, currency: string) {
  return findMany(FuelModel, { userId, currency })
}

export function getFuelByYear(userId: string, currency: string, year: number) {
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 1)
  return findMany(FuelModel, { userId, currency, date: { $gte: start, $lt: end } })
}

export function createFuelEntry(data: Omit<Fuel, '_id' | 'createdAt' | 'liters'>) {
  const liters = parseFloat((data.totalCost / data.pricePerLiter).toFixed(3))
  return createOne(FuelModel, { ...data, liters })
}

export function updateFuelEntry(id: string, data: Partial<Omit<Fuel, 'liters'>>) {
  const updates: Partial<Fuel> = { ...data }
  if (data.totalCost !== undefined && data.pricePerLiter !== undefined) {
    updates.liters = parseFloat((data.totalCost / data.pricePerLiter).toFixed(3))
  }
  return updateOne(FuelModel, id, updates)
}

export function deleteFuelEntry(id: string) {
  return deleteOne(FuelModel, id)
}
