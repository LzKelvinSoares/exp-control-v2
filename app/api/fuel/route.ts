import { NextRequest } from 'next/server'
import { withAuth, ok, err } from '@/lib/api'
import { useService } from '@/lib/providers/service-provider';

export const GET = withAuth(async (req, ctx) => {
  const { fuelService } = useService();
  const month = Number(req.nextUrl.searchParams.get('month'));
  const year = Number(req.nextUrl.searchParams.get('year'));
  if (!month || !year) return err('month and year are required');
  return ok(await fuelService.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year }));
})

export const POST = withAuth(async (req: NextRequest, ctx) => {
  const { fuelService } = useService();
  const body = await req.json();
  return ok(await fuelService.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency }));
})

export const PUT = withAuth(async (req: NextRequest, _ctx) => {
  const { fuelService } = useService();
  const { id, ...body } = await req.json();
  if (!id) return err('id is required');
  return ok(await fuelService.update(id, body));
})

export const DELETE = withAuth(async (req: NextRequest, _ctx) => {
  const { fuelService } = useService();
  const { id } = await req.json();
  if (!id) return err('id is required');
  await fuelService.delete(id);
  return ok({ success: true });
})
