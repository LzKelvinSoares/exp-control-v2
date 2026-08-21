import mongoose, { Schema, model, models } from 'mongoose'
import { CURRENCY_ENUM } from '@/constants/enums'
import { Currency } from '@/types/app-types'
import { PageKey } from '@/types/app-types/auth'

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  currencyAccounts: Currency[]
  currentCurrency: Currency
  points: number
  access: PageKey[]
  googleRefreshToken?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  id: { type: String, default: () => crypto.randomUUID() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: '' },
  currencyAccounts: [
    { type: String, enum: CURRENCY_ENUM, required: true },
  ],
  currentCurrency: { type: String, enum: CURRENCY_ENUM, default: 'BRL' },
  points: { type: Number, default: 0 },
  access: { type: [String], default: [] },
  googleRefreshToken: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
}, { id: false })

const UserModel = models.User || model<IUser>('User', UserSchema)

export default UserModel
