import { Schema, model, models } from 'mongoose'
import type { Expense } from '@/types'
import { CURRENCY_ENUM, EXPENSE_CATEGORY_ENUM } from '@/constants/enums'

const MarketShoppingItemSchema = new Schema({
  description:  { type: String, required: true },
  quantity:     { type: Number, required: true },
  unit:         { type: String, required: true },
  value:        { type: Number, required: true },
  valuePerUnit: { type: Number, required: true },
}, { _id: true })

const ExpenseSchema = new Schema<Expense>({
  userId:          { type: String, required: true, index: true },
  currency:        { type: String, enum: CURRENCY_ENUM, required: true },
  description:     { type: String, required: true },
  category:        { type: String, enum: EXPENSE_CATEGORY_ENUM, required: true },
  responsible:     { type: String, required: true },
  value:           { type: Number, required: true },
  month:           { type: Number, required: true },
  year:            { type: Number, required: true },
  installments:    { type: Number },
  parentExpenseId: { type: String },
  marketItems:     { type: [MarketShoppingItemSchema], default: [] },
  createdAt:       { type: Date, default: Date.now },
})

ExpenseSchema.index({ userId: 1, currency: 1, year: 1, month: 1 })

const ExpenseModel = models.Expense || model<Expense>('Expense', ExpenseSchema)

export default ExpenseModel
