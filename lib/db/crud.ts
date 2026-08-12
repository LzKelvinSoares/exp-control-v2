import type { Model, UpdateQuery, Document } from 'mongoose'
import { connectDB } from '@/lib/mongodb'

type Filter<T> = Partial<Record<keyof T, unknown>> & Record<string, unknown>

export async function findMany<T>(
  model: Model<T>,
  filter: Filter<T> = {},
): Promise<T[]> {
  await connectDB()
  return model.find(filter).lean({ virtuals: true }) as Promise<T[]>
}

export async function findOne<T>(
  model: Model<T>,
  filter: Filter<T>,
): Promise<T | null> {
  await connectDB()
  return model.findOne(filter).lean({ virtuals: true }) as Promise<T | null>
}

export async function findById<T>(
  model: Model<T>,
  id: string,
): Promise<T | null> {
  await connectDB()
  return model.findOne({
    id
  }).lean({ virtuals: true }) as Promise<T | null>
}

export async function createOne<T>(
  model: Model<T>,
  data: Partial<T>,
): Promise<T> {
  await connectDB()
  const doc = await model.create(data)
  return doc.toObject({ virtuals: true }) as T
}

export async function createMany<T>(
  model: Model<T>,
  data: Partial<T>[],
): Promise<T[]> {
  await connectDB()
  const docs = await model.insertMany(data)
  return (docs as unknown as Document[]).map((doc) => doc.toObject({ virtuals: true })) as T[]
}

export async function updateOne<T>(
  model: Model<T>,
  id: string,
  data: UpdateQuery<T>,
): Promise<T | null> {
  await connectDB()
  return model.findOneAndUpdate({ id }, data, { new: true }).lean({ virtuals: true }) as Promise<T | null>
}

export async function updateMany<T>(
  model: Model<T>,
  filter: Filter<T>,
  data: UpdateQuery<T>,
): Promise<void> {
  await connectDB()
  await model.updateMany(filter, data)
}

export async function deleteOne<T>(
  model: Model<T>,
  id: string,
): Promise<void> {
  await connectDB()
  await model.findOneAndDelete({ id })
}
