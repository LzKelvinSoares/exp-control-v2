import { Bill } from '@/types/app-types'
import { Schema, model, models } from 'mongoose'

const BillSchema = new Schema<Bill>({
  id:                      { type: String, default: () => crypto.randomUUID() },
  userId:                  { type: String, required: true, index: true },
  currencyCurrencyAccount: { type: String, required: true },
  description:             { type: String, required: true },
  type:                    { type: String, required: true },
  typeDescription:         { type: String },
  responsible:             { type: String },
  value:                   { type: Number, required: true },
  expirationDate:          { type: String, required: true },
  barCode:                 { type: String },
  paid:                    { type: Boolean, default: false },
  paidAt:                  { type: Date },
  creationDate:            { type: Date, default: Date.now },
}, { id: false })

BillSchema.index({ userId: 1, currencyCurrencyAccount: 1, paid: 1, expirationDate: 1 })

const BillModel = models.Bill || model<Bill>('Bill', BillSchema)

export default BillModel
