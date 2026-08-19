import { ok, err } from '@/lib/actions/services/api.service'
import { withServices } from '../middlewares';

export function createRevenuesRoutes() {
  return {
    GET: withServices(async (req, { revenuesService }, ctx) => {
      return ok(await revenuesService.get(req, ctx));
    }),

    POST: withServices(async (req, { revenuesService }, ctx) => {
      return ok(await revenuesService.create(req, ctx));
    }),

    PUT: withServices(async (req, { revenuesService }, _ctx) => {
      const { id } = await req.json();
      if (!id) return err('id is required');
      return ok(await revenuesService.update(req));
    }),

    DELETE: withServices(async (req, { revenuesService }, _ctx) => {
      const { id } = await req.json();
      if (!id) return err('id is required');
      await revenuesService.delete(id);
      return ok({ success: true });
    }),
  }
}
