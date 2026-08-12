import SaleModel from '@/models/Sale'
import { findMany, createOne, updateOne, deleteOne, findById } from './crud'
import type { Sale } from '@/types'

export function getSales() {
  return findMany(SaleModel, {})
}

export function createSale(data: Omit<Sale, 'id' | 'createdAt'>) {
  return createOne(SaleModel, data)
}

export async function updateSale(id: string, data: Partial<Sale>): Promise<Sale | null> {
  const updated = await updateOne(SaleModel, id, data)

  // sync payment/delivery status to tied item
  if (updated && (data.paymentStatus || data.deliveryStatus)) {
    const sale = updated as Sale & { tiedSaleId?: string }
    if (sale.tiedSaleId) {
      const syncFields: Partial<Sale> = {}
      if (data.paymentStatus) syncFields.paymentStatus = data.paymentStatus
      if (data.deliveryStatus) syncFields.deliveryStatus = data.deliveryStatus
      await updateOne(SaleModel, sale.tiedSaleId, syncFields)
    }
  }

  return updated
}

export function deleteSale(id: string) {
  return deleteOne(SaleModel, id)
}

export function getSaleById(id: string) {
  return findById(SaleModel, id)
}
