import { err, ok } from '../services';
import { NextRequest } from 'next/server';
import { AuthContext } from '@/types/server-types';
import { withServices } from '../middlewares';

export function createSalesRoutes() {
    return {
        GET: withServices(async (req, { salesService }, ctx) => {
            return ok(await salesService.get(req, ctx));
        }),
        POST: withServices(async (req: NextRequest, { salesService }, ctx: AuthContext) => {
            return ok(await salesService.create(req, ctx));
        }),
        PUT: withServices(async (req: NextRequest, { salesService }, _ctx) => {
            const { id } = await req.json();
            if (!id) return err('id is required');
            return ok(await salesService.update(req));
        }),
        DELETE: withServices(async (req: NextRequest, { salesService }, _ctx) => {
            const { id } = await req.json();
            if (!id) return err('id is required');
            await salesService.delete(id);
            return ok({ success: true });
        })
    }
}