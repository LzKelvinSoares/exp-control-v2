import { NextRequest } from 'next/server'
import { withAuth, ok, err, AuthContext } from '@/lib/api'
import { findById } from '@/lib/db/crud'
import BillModel from '@/models/Bill'
import { POINTS } from '@/constants'
import { refreshAccessToken, createCalendarEvent } from '@/lib/google-calendar'
import { Bill } from '@/types/app-types'
import { useService } from '@/hooks/api'

export const GET = withAuth(async (req, ctx) => {
  const {billsService} = useService();
  const dueSoon = req.nextUrl.searchParams.get('dueSoon')
  if (dueSoon) {
    return ok(await billsService.getBillsDueSoon(ctx.userId, ctx.currency, Number(dueSoon)));
  }
  const month = Number(req.nextUrl.searchParams.get('month'));
  const year = Number(req.nextUrl.searchParams.get('year'));
  if (!month || !year) return err('month and year are required');
  return ok(await billsService.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year }));
});

const EXPENSE_CATEGORIES = new Set([
  'ENERGIA', 'AGUA', 'GAS', 'INTERNET', 'TELEFONE', 'ALUGUEL', 'CARTAO', 'OUTROS',
]);

export const POST = withAuth(async (req: NextRequest, ctx: AuthContext) => {
  const {billsService, expensesService, userService} = useService();
  const { saveAsExpense, ...body } = await req.json();
  const bill = await billsService.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency });
  await userService.addUserPoints(ctx.userId, POINTS.BILL_SAVED);

  if (bill && bill.length > 0) {
    if (saveAsExpense) {
      const expenseType = EXPENSE_CATEGORIES.has(bill[0].type) ? bill[0].type : 'OUTROS';
      await expensesService.create({
        description: bill[0].description,
        type: expenseType,
        value: bill[0].value,
        firstExpirationDate: bill[0].expirationDate as string,
        monthsLeft: 1,
        userId: ctx.userId,
        currencyCurrencyAccount: ctx.currency,
      });
    }

    // Fire-and-forget: never block or fail bill creation
    userService.getGoogleRefreshToken(ctx.userId).then(async (refreshToken: string | null) => {
      if (!refreshToken) return;
      const accessToken = await refreshAccessToken(refreshToken);
      if (!accessToken) return;
      await createCalendarEvent(accessToken, {
        ...bill[0] as Bill,
        expirationDate: String((bill[0] as Bill).expirationDate),
      });
    }).catch(() => {});
  }

  return ok(bill);
})

export const PUT = withAuth(async (req: NextRequest, ctx: AuthContext) => {
  const { id, action, ids, ...body } = await req.json();
  const {billsService, userService} = useService();

  if (action === 'payMany' && ids) {
    await billsService.payBills(ids);
    // award points per bill based on due date
    await Promise.all(
      (ids as string[]).map(async (billId) => {
        const bill = await findById<Bill>(BillModel, billId);
        if (!bill) return;
        const isLate = bill.expirationDate && new Date(bill.expirationDate) < new Date();
        await userService.addUserPoints(ctx.userId, isLate ? POINTS.BILL_PAID_LATE : POINTS.BILL_PAID_ON_TIME);
      })
    );
    return ok({ success: true });
  }

  if (action === 'pay' && id) {
    const bill = await findById<Bill>(BillModel, id);
    await billsService.payBill(id);
    if (bill) {
      const isLate = bill.expirationDate && new Date(bill.expirationDate) < new Date();
      await userService.addUserPoints(ctx.userId, isLate ? POINTS.BILL_PAID_LATE : POINTS.BILL_PAID_ON_TIME);
    }
    return ok({ success: true });
  }

  if (!id) return err('id is required');
  return ok(await billsService.update(id, body));
})

export const DELETE = withAuth(async (req: NextRequest, _ctx: AuthContext) => {
  const { id } = await req.json();
  const { billsService } = useService();
  if (!id) return err('id is required');
  await billsService.delete(id);
  return ok({ success: true });
})
