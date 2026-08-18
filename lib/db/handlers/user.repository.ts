import UserModel from '@/models/User'
import { connectDB } from '@/lib/mongodb'

export interface IUserRepository {
  addUserPoints: (userId: string, delta: number) => Promise<void>;
  getUserPoints: (userId: string) => Promise<number>;
  saveGoogleRefreshToken: (userId: string, refreshToken: string) => Promise<void>;
  getGoogleRefreshToken: (userId: string) => Promise<string | null>;
}

export class UserRepository implements IUserRepository {
  async addUserPoints(userId: string, delta: number): Promise<void> {
    await connectDB()
    await UserModel.findOneAndUpdate({ id: userId }, { $inc: { points: delta } })
  }

  async getUserPoints(userId: string): Promise<number> {
    await connectDB()
    const user = await UserModel.findOne({ id: userId }).select('points').lean()
    return (user as { points?: number } | null)?.points ?? 0
  }

  async saveGoogleRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await UserModel.findOneAndUpdate({ id: userId }, { googleRefreshToken: refreshToken })
  }

  async getGoogleRefreshToken(userId: string): Promise<string | null> {
    await connectDB()
    const user = await UserModel.findOne({ id: userId }).select('googleRefreshToken').lean()
    return (user as { googleRefreshToken?: string } | null)?.googleRefreshToken ?? null
  }
}
