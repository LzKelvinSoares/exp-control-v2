import { NextRequest } from 'next/server'
import { withAuth, ok, err } from '@/lib/api'
import { getSales, createSale, updateSale, deleteSale } from '@/lib/db'

export const GET = withAuth(async (_req, _ctx) => {
  return ok(await getSales())
})

export const POST = withAuth(async (req: NextRequest, _ctx) => {
  const body = await req.json()
  return ok(await createSale(body))
})

export const PUT = withAuth(async (req: NextRequest, _ctx) => {
  const { id, ...body } = await req.json()
  if (!id) return err('id is required')
  return ok(await updateSale(id, body))
})

export const DELETE = withAuth(async (req: NextRequest, _ctx) => {
  const { id } = await req.json()
  if (!id) return err('id is required')
  await deleteSale(id)
  return ok({ success: true })
})
