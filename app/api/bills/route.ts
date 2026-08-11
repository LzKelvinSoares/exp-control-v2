import { NextRequest } from 'next/server'
import { withAuth, ok, err } from '@/lib/api'
import { getBills, getBillsDueSoon, createBill, updateBill, payBill, payBills, deleteBill } from '@/lib/db'

export const GET = withAuth(async (req, ctx) => {
  const dueSoon = req.nextUrl.searchParams.get('dueSoon')
  if (dueSoon) {
    return ok(await getBillsDueSoon(ctx.userId, ctx.currency, Number(dueSoon)))
  }
  return ok(await getBills(ctx.userId, ctx.currency))
})

export const POST = withAuth(async (req: NextRequest, ctx) => {
  const body = await req.json()
  return ok(await createBill({ ...body, userId: ctx.userId, currency: ctx.currency }))
})

export const PUT = withAuth(async (req: NextRequest, _ctx) => {
  const { id, action, ids, ...body } = await req.json()

  if (action === 'payMany' && ids) return ok(await payBills(ids))
  if (action === 'pay' && id)     return ok(await payBill(id))
  if (!id)                        return err('id is required')

  return ok(await updateBill(id, body))
})

export const DELETE = withAuth(async (req: NextRequest, _ctx) => {
  const { id } = await req.json()
  if (!id) return err('id is required')
  await deleteBill(id)
  return ok({ success: true })
})
