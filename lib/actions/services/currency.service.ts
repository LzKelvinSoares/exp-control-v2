'use server'

import { auth } from '@/lib/actions/services/auth.service'
import { connectDB } from '@/lib/mongodb'
import UserModel from '@/models/User'
import { Currency } from '@/types/app-types'

export async function switchCurrency(currency: Currency) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  await connectDB()
  await UserModel.findOneAndUpdate({ id: session.user.id }, { currentCurrency: currency })
}
