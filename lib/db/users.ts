import UserModel from '@/models/User'
import { connectDB } from '@/lib/mongodb'

export async function addUserPoints(userId: string, delta: number): Promise<void> {
  await connectDB()
  await UserModel.findOneAndUpdate({ id: userId }, { $inc: { points: delta } })
}

export async function getUserPoints(userId: string): Promise<number> {
  await connectDB()
  const user = await UserModel.findOne({ id: userId }).select('points').lean()
  return (user as { points?: number } | null)?.points ?? 0
}

export async function saveGoogleRefreshToken(userId: string, refreshToken: string): Promise<void> {
  await connectDB()
  await UserModel.findOneAndUpdate({ id: userId }, { googleRefreshToken: refreshToken })
}

export async function getGoogleRefreshToken(userId: string): Promise<string | null> {
  await connectDB()
  const user = await UserModel.findOne({ id: userId }).select('googleRefreshToken').lean()
  return (user as { googleRefreshToken?: string } | null)?.googleRefreshToken ?? null
}
