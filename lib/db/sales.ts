import SaleModel from '@/models/Sale'
import { findMany, createOne, updateOne, deleteOne, findById } from './crud'
import type { Sale } from '@/types'

export function getSales() {
  return findMany(SaleModel, {})
}

export function createSale(data: Omit<Sale, 'id' | 'creationDate'>) {
  return createOne(SaleModel, data)
}

export async function updateSale(id: string, data: Partial<Sale>): Promise<Sale | null> {
  return updateOne(SaleModel, id, data)
}

export function deleteSale(id: string) {
  return deleteOne(SaleModel, id)
}

export function getSaleById(id: string) {
  return findById(SaleModel, id)
}
