import { Schema, model, models } from 'mongoose'
import type { Expense } from '@/types'

const MarketShoppingItemSchema = new Schema({
  id:           { type: String, default: () => crypto.randomUUID() },
  description:  { type: String, required: true },
  quantity:     { type: Number, required: true },
  unit:         { type: String, required: true },
  value:        { type: Number, required: true },
  valuePerUnit: { type: Number, required: true },
}, { _id: false, id: false })

const ExpenseSchema = new Schema<Expense>({
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
  marketItems:             { type: [MarketShoppingItemSchema], default: [] },
  creationDate:            { type: Date, default: Date.now },
}, { id: false, collection: 'expense' })

ExpenseSchema.index({ userId: 1, currencyCurrencyAccount: 1, firstExpirationDate: 1 })

const ExpenseModel = models.Expense || model<Expense>('Expense', ExpenseSchema)

export default ExpenseModel
