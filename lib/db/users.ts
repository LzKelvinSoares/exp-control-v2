import UserModel from '@/models/User'
import { connectDB } from '@/lib/mongodb'

export async function addUserPoints(userId: string, delta: number): Promise<void> {
  await connectDB()
  await UserModel.findByIdAndUpdate(userId, { $inc: { points: delta } })
}

export async function getUserPoints(userId: string): Promise<number> {
  await connectDB()
  const user = await UserModel.findById(userId).select('points').lean()
  return (user as { points?: number } | null)?.points ?? 0
}
