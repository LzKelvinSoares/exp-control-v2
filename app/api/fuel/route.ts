import { NextRequest } from 'next/server'
import { withAuth, ok, err } from '@/lib/api'
import { getFuelEntries, createFuelEntry, updateFuelEntry, deleteFuelEntry } from '@/lib/db'

export const GET = withAuth(async (req, ctx) => {
  const month = Number(req.nextUrl.searchParams.get('month'))
  const year = Number(req.nextUrl.searchParams.get('year'))
  if (!month || !year) return err('month and year are required')
  return ok(await getFuelEntries(ctx.userId, ctx.currency, month, year))
})

export const POST = withAuth(async (req: NextRequest, ctx) => {
  const body = await req.json()
  return ok(await createFuelEntry({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency }))
})

export const PUT = withAuth(async (req: NextRequest, _ctx) => {
  const { id, ...body } = await req.json()
  if (!id) return err('id is required')
  return ok(await updateFuelEntry(id, body))
})

export const DELETE = withAuth(async (req: NextRequest, _ctx) => {
  const { id } = await req.json()
  if (!id) return err('id is required')
  await deleteFuelEntry(id)
  return ok({ success: true })
})
