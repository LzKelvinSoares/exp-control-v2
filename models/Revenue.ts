import { Schema, model, models } from 'mongoose'
import type { Revenue } from '@/types'
import { CURRENCY_ENUM, REVENUE_CATEGORY_ENUM } from '@/constants/enums'

const RevenueSchema = new Schema<Revenue>({
  userId:          { type: String, required: true, index: true },
  currency:        { type: String, enum: CURRENCY_ENUM, required: true },
  description:     { type: String, required: true },
  category:        { type: String, enum: REVENUE_CATEGORY_ENUM, required: true },
  responsible:     { type: String, required: true },
  value:           { type: Number, required: true },
  month:           { type: Number, required: true },
  year:            { type: Number, required: true },
  installments:    { type: Number },
  parentRevenueId: { type: String },
  createdAt:       { type: Date, default: Date.now },
})

RevenueSchema.index({ userId: 1, currency: 1, year: 1, month: 1 })

const RevenueModel = models.Revenue || model<Revenue>('Revenue', RevenueSchema)

export default RevenueModel
