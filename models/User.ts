import mongoose, { Schema, model, models } from 'mongoose'
import type { CurrencyAccount, Currency } from '@/types'
import { CURRENCY_ENUM } from '@/constants/enums'

interface IUser {
  name: string
  email: string
  password: string
  currencyAccounts: CurrencyAccount[]
  currentCurrency: Currency
  points: number
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: '' },
  currencyAccounts: [
    {
      currency: { type: String, enum: CURRENCY_ENUM, required: true },
      label: { type: String, required: true },
    },
  ],
  currentCurrency: { type: String, enum: CURRENCY_ENUM, default: 'BRL' },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const UserModel = models.User || model<IUser>('User', UserSchema)

export default UserModel
