import { ok, err, executeDeleteWithIdValidation } from '@/lib/actions/services/api.service';
import { withServices } from '../middlewares';

export function createBillsRoutes() {
    return {
        GET: withServices(async (req, ctx, { billsService }) => {
            return ok(await billsService.get(req, ctx));
        }),

        POST: withServices(async (req, ctx, { billsService }) => {
            return ok(await billsService.create(req, ctx));
        }),

        PUT: withServices(async (req, ctx, { billsService }) => {
            const { action, ...body } = await req.json();

            if (['pay', 'payMany'].includes(action)) {
                await billsService.pay(action, body.id, body.ids, ctx);
                return ok({ success: true });
            }
       
            if (!body.id) return err('id is required');
            return ok(await billsService.update(body, ctx));
        }),

        DELETE: withServices(async (req, ctx, { billsService }) => {
           return executeDeleteWithIdValidation(req, ctx, billsService);
        })
    }
}