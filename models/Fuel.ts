import { Schema, model, models } from 'mongoose'
import type { Fuel } from '@/types'
import { CURRENCY_ENUM } from '@/constants/enums'

const FuelSchema = new Schema<Fuel>({
  userId:        { type: String, required: true, index: true },
  currency:      { type: String, enum: CURRENCY_ENUM, required: true },
  date:          { type: Date, required: true },
  totalCost:     { type: Number, required: true },
  pricePerLiter: { type: Number, required: true },
  liters:        { type: Number, required: true },
  createdAt:     { type: Date, default: Date.now },
})

FuelSchema.index({ userId: 1, currency: 1, date: -1 })

const FuelModel = models.Fuel || model<Fuel>('Fuel', FuelSchema)

export default FuelModel
