import { NextRequest } from 'next/server'
import { withAuth, ok, err } from '@/lib/api'
import { getBills, getBillsDueSoon, createBill, updateBill, payBill, payBills, deleteBill } from '@/lib/db'
import { addUserPoints } from '@/lib/db/users'
import { findById } from '@/lib/db/crud'
import BillModel from '@/models/Bill'
import { POINTS } from '@/constants'
import type { Bill } from '@/types'

export const GET = withAuth(async (req, ctx) => {
  const dueSoon = req.nextUrl.searchParams.get('dueSoon')
  if (dueSoon) {
    return ok(await getBillsDueSoon(ctx.userId, ctx.currency, Number(dueSoon)))
  }
  return ok(await getBills(ctx.userId, ctx.currency))
})

export const POST = withAuth(async (req: NextRequest, ctx) => {
  const body = await req.json()
  const bill = await createBill({ ...body, userId: ctx.userId, currency: ctx.currency })
  await addUserPoints(ctx.userId, POINTS.BILL_SAVED)
  return ok(bill)
})

export const PUT = withAuth(async (req: NextRequest, ctx) => {
  const { id, action, ids, ...body } = await req.json()

  if (action === 'payMany' && ids) {
    await payBills(ids)
    // award points per bill based on due date
    await Promise.all(
      (ids as string[]).map(async (billId) => {
        const bill = await findById<Bill>(BillModel, billId)
        if (!bill) return
        const isLate = bill.dueDate && new Date(bill.dueDate) < new Date()
        await addUserPoints(ctx.userId, isLate ? POINTS.BILL_PAID_LATE : POINTS.BILL_PAID_ON_TIME)
      })
    )
    return ok({ success: true })
  }

  if (action === 'pay' && id) {
    const bill = await findById<Bill>(BillModel, id)
    await payBill(id)
    if (bill) {
      const isLate = bill.dueDate && new Date(bill.dueDate) < new Date()
      await addUserPoints(ctx.userId, isLate ? POINTS.BILL_PAID_LATE : POINTS.BILL_PAID_ON_TIME)
    }
    return ok({ success: true })
  }

  if (!id) return err('id is required')
  return ok(await updateBill(id, body))
})

export const DELETE = withAuth(async (req: NextRequest, _ctx) => {
  const { id } = await req.json()
  if (!id) return err('id is required')
  await deleteBill(id)
  return ok({ success: true })
})
