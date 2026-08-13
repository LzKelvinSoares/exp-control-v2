import { NextRequest } from 'next/server'
import { withAuth, ok, err } from '@/lib/api'
import { getBills, getBillsDueSoon, createBill, updateBill, payBill, payBills, deleteBill } from '@/lib/db'
import { addUserPoints, getGoogleRefreshToken } from '@/lib/db/users'
import { findById } from '@/lib/db/crud'
import BillModel from '@/models/Bill'
import { POINTS } from '@/constants'
import { refreshAccessToken, createCalendarEvent } from '@/lib/google-calendar'
import type { Bill } from '@/types'

export const GET = withAuth(async (req, ctx) => {
  const dueSoon = req.nextUrl.searchParams.get('dueSoon')
  if (dueSoon) {
    return ok(await getBillsDueSoon(ctx.userId, ctx.currency, Number(dueSoon)))
  }
  const month = Number(req.nextUrl.searchParams.get('month'))
  const year = Number(req.nextUrl.searchParams.get('year'))
  if (!month || !year) return err('month and year are required')
  return ok(await getBills(ctx.userId, ctx.currency, month, year))
})

export const POST = withAuth(async (req: NextRequest, ctx) => {
  const body = await req.json()
  const bill = await createBill({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency })
  await addUserPoints(ctx.userId, POINTS.BILL_SAVED)

  // Fire-and-forget: never block or fail bill creation
  getGoogleRefreshToken(ctx.userId).then(async (refreshToken) => {
    if (!refreshToken) return
    const accessToken = await refreshAccessToken(refreshToken)
    if (!accessToken) return
    await createCalendarEvent(accessToken, bill as Bill)
  }).catch(() => {})

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
        const isLate = bill.expirationDate && new Date(bill.expirationDate) < new Date()
        await addUserPoints(ctx.userId, isLate ? POINTS.BILL_PAID_LATE : POINTS.BILL_PAID_ON_TIME)
      })
    )
    return ok({ success: true })
  }

  if (action === 'pay' && id) {
    const bill = await findById<Bill>(BillModel, id)
    await payBill(id)
    if (bill) {
      const isLate = bill.expirationDate && new Date(bill.expirationDate) < new Date()
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
