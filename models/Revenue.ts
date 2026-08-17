import { Budget } from '@/types/app-types'
import { Schema, model, models } from 'mongoose'

const RevenueSchema = new Schema<Budget>({
  id:                      { type: String, default: () => crypto.randomUUID() },
  userId:                  { type: String, required: true, index: true },
  currencyCurrencyAccount: { type: String, required: true },
  description:             { type: String, required: true },
  type:                    { type: String, required: true },
  typeDescription:         { type: String },
  responsible:             { type: String },
  value:                   { type: Number, required: true },
  firstExpirationDate:     { type: String, required: true },
  monthsLeft:              { type: Number },
  parentBudgetId:          { type: String },
  creationDate:            { type: Date, default: Date.now },
}, { id: false, collection: 'revenue' })

RevenueSchema.index({ userId: 1, currencyCurrencyAccount: 1, firstExpirationDate: 1 })

const RevenueModel = models.Revenue || model<Budget>('Revenue', RevenueSchema)

export default RevenueModel
