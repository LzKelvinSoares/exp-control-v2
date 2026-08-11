import { Schema, model, models } from 'mongoose'
import type { Bill } from '@/types'
import { CURRENCY_ENUM, BILL_CATEGORY_ENUM } from '@/constants/enums'

const BillSchema = new Schema<Bill>({
  userId:   { type: String, required: true, index: true },
  currency: { type: String, enum: CURRENCY_ENUM, required: true },
  name:     { type: String, required: true },
  category: { type: String, enum: BILL_CATEGORY_ENUM, required: true },
  value:    { type: Number, required: true },
  dueDate:  { type: Date, required: true },
  barcode:  { type: String },
  paid:     { type: Boolean, default: false },
  paidAt:   { type: Date },
  createdAt:{ type: Date, default: Date.now },
})

BillSchema.index({ userId: 1, currency: 1, paid: 1, dueDate: 1 })

const BillModel = models.Bill || model<Bill>('Bill', BillSchema)

export default BillModel
