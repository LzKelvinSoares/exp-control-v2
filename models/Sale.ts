import { Schema, model, models } from 'mongoose'
import type { Sale } from '@/types'
import { SALE_ROOM_ENUM } from '@/constants/enums'

const SaleSchema = new Schema<Sale>({
  id:               { type: String, default: () => crypto.randomUUID() },
  description:      { type: String, required: true },
  room:             { type: String, enum: SALE_ROOM_ENUM, required: true },
  roomDescription:  { type: String },
  buyer:            { type: String },
  value:            { type: Number, required: true },
  valuePaid:        { type: String },
  discount:         { type: String },
  installments:     { type: Number, default: 1 },
  bookingDate:      { type: Date },
  saleDate:         { type: Date },
  paid:             { type: Boolean, default: false },
  delivered:        { type: Boolean, default: false },
  tieIn:            { type: Boolean, default: false },
  tiedInItem:       { type: String },
  tiedInItemValue:  { type: String },
  boughtTogether:   { type: Boolean, default: false },
  imgId:            { type: String, default: null },
  creationDate:     { type: Date, default: Date.now },
}, { id: false, collection: 'sale' })

const SaleModel = models.Sale || model<Sale>('Sale', SaleSchema)

export default SaleModel
