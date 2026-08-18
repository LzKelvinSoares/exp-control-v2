import { useRepository } from '@/hooks/api';
import { err, ok, withAuth } from '../services';
import { NextRequest } from 'next/server';

export function createFuelRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { fuelRepository } = useRepository();
            const month = Number(req.nextUrl.searchParams.get('month'));
            const year = Number(req.nextUrl.searchParams.get('year'));
            if (!month || !year) return err('month and year are required');
            return ok(await fuelRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year }));
        }),
        POST: withAuth(async (req: NextRequest, ctx) => {
            const { fuelRepository } = useRepository();
            const body = await req.json();
            return ok(await fuelRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency }));
        }),
        PUT: withAuth(async (req: NextRequest, _ctx) => {
            const { fuelRepository } = useRepository();
            const { id, ...body } = await req.json();
            if (!id) return err('id is required');
            return ok(await fuelRepository.update(id, body));
        }),
        DELETE: withAuth(async (req: NextRequest, _ctx) => {
            const { fuelRepository } = useRepository();
            const { id } = await req.json();
            if (!id) return err('id is required');
            await fuelRepository.delete(id);
            return ok({ success: true });
        })
    }
}