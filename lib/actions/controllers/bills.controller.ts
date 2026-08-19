import { NextRequest } from 'next/server';
import { withAuth, ok, err, AuthContext } from '@/lib/actions/services/api.service';
import { useServices } from '@/hooks/api';

export function createBillsRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { billsService } = useServices();
            return ok(await billsService.getBills(req, ctx));
        }),
        POST: withAuth(async (req: NextRequest, ctx: AuthContext) => {
            const { billsService } = useServices();
            return ok(await billsService.createBill(req, ctx));
        }),
        PUT: withAuth(async (req: NextRequest, ctx: AuthContext) => {
            const { id, action } = await req.json();
            const { billsService } = useServices();

            if (['pay', 'payMany'].includes(action)) {
                await billsService.pay(req, ctx);
                return ok({ success: true });
            }

            if (!id) return err('id is required');
            return ok(await billsService.updateBill(req, ctx));
        }),
        DELETE: withAuth(async (req: NextRequest, _ctx: AuthContext) => {
            const { id } = await req.json();
            const { billsService } = useServices();
            if (!id) return err('id is required');
            await billsService.deleteBill(id);
            return ok({ success: true });
        })
    }
}