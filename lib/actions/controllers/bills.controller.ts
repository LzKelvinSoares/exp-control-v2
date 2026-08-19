import { ok, err } from '@/lib/actions/services/api.service';
import { withAuth, withServices } from '../middlewares';

export function createBillsRoutes() {
    return {
        GET: withServices(async (req, { billsService }) =>
                withAuth(async (req, ctx) => {
                    return ok(await billsService.get(req, ctx));
                })(req)
        ),
        POST: withServices(async (req, { billsService }) =>
            withAuth(async (req, ctx) => {
                return ok(await billsService.create(req, ctx));
            })(req)
        ),
        PUT: withServices(async (req, { billsService }) =>
            withAuth(async (req, ctx) => {
                const { id, action } = await req.json();

            if (['pay', 'payMany'].includes(action)) {
                await billsService.pay(req, ctx);
                return ok({ success: true });
            }

                if (!id) return err('id is required');
                return ok(await billsService.update(req));
            })(req)
        ),
        DELETE: withServices(async (req, { billsService }) =>
            withAuth(async (req, ctx) => {
                const { id } = await req.json();
                if (!id) return err('id is required');
                await billsService.delete(id);
                return ok({ success: true });
            })(req)
        )
    }
}