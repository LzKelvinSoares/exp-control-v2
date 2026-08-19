import { NextRequest } from 'next/server';
import { withAuth, ok, err } from '@/lib/actions/services/api.service';
import { IBillsService } from '../services';
import { AuthContext } from '@/types/server-types';

export function createBillsRoutes(billsService: IBillsService) {
    return {
        GET: withAuth(async (req, ctx) => {
            return ok(await billsService.get(req, ctx));
        }),
        POST: withAuth(async (req: NextRequest, ctx: AuthContext) => {
            return ok(await billsService.create(req, ctx));
        }),
        PUT: withAuth(async (req: NextRequest, ctx: AuthContext) => {
            const { id, action } = await req.json();

            if (['pay', 'payMany'].includes(action)) {
                await billsService.pay(req, ctx);
                return ok({ success: true });
            }

            if (!id) return err('id is required');
            return ok(await billsService.update(req));
        }),
        DELETE: withAuth(async (req: NextRequest, _ctx: AuthContext) => {
            const { id } = await req.json();
            if (!id) return err('id is required');
            await billsService.delete(id);
            return ok({ success: true });
        })
    }
}