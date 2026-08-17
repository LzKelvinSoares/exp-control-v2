import { Fuel } from '@/types/app-types'
import { Schema, model, models } from 'mongoose'

const FuelSchema = new Schema<Fuel>({
  id:                      { type: String, default: () => crypto.randomUUID() },
  userId:                  { type: String, required: true, index: true },
  currencyCurrencyAccount: { type: String, required: true },
  creationDate:            { type: String },
  value:                   { type: Number, required: true },
  valuePerLiter:           { type: Number, required: true },
}, { id: false, collection: 'fuel' })

FuelSchema.index({ userId: 1, currencyCurrencyAccount: 1, creationDate: -1 })

const FuelModel = models.Fuel || model<Fuel>('Fuel', FuelSchema)

export default FuelModel
