import { Schema, model, models } from 'mongoose'
import type { Sale } from '@/types'
import { SALE_ROOM_ENUM, PAYMENT_STATUS_ENUM, DELIVERY_STATUS_ENUM } from '@/constants/enums'

const SaleSchema = new Schema<Sale>({
  name:           { type: String, required: true },
  room:           { type: String, enum: SALE_ROOM_ENUM, required: true },
  buyer:          { type: String },
  value:          { type: Number, required: true },
  discount:       { type: Number, default: 0 },
  installments:   { type: Number, default: 1 },
  bookingDate:    { type: Date },
  saleDate:       { type: Date },
  paymentStatus:  { type: String, enum: PAYMENT_STATUS_ENUM, default: 'PENDING' },
  deliveryStatus: { type: String, enum: DELIVERY_STATUS_ENUM, default: 'PENDING' },
  imageId:        { type: String },
  tiedSaleId:     { type: String },
  createdAt:      { type: Date, default: Date.now },
})

const SaleModel = models.Sale || model<Sale>('Sale', SaleSchema)

export default SaleModel
