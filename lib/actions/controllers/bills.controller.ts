import { ok, err } from '@/lib/actions/services/api.service';
import { withServices } from '../middlewares';

export function createBillsRoutes() {
    return {
        GET: withServices(async (req, { billsService }, ctx) => {
            return ok(await billsService.get(req, ctx));
        }),

        POST: withServices(async (req, { billsService }, ctx) => {
            return ok(await billsService.create(req, ctx));
        }),

        PUT: withServices(async (req, { billsService }, ctx) => {
            const { id, action } = await req.json();

            if (['pay', 'payMany'].includes(action)) {
                await billsService.pay(req, ctx);
                return ok({ success: true });
            }

            if (!id) return err('id is required');
            return ok(await billsService.update(req));
        }),

        DELETE: withServices(async (req, { billsService }, _ctx) => {
            const { id } = await req.json();
            if (!id) return err('id is required');
            await billsService.delete(id);
            return ok({ success: true });
        })
    }
}