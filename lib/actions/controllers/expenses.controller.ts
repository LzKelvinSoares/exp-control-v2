import { ok, err } from '@/lib/actions/services/api.service'
import { withServices } from '../middlewares';

export function createExpensesRoutes() {
  return {
    GET: withServices(async (req, { expensesService }, ctx) => {
      return ok(await expensesService.get(req, ctx));
    }),

    POST: withServices(async (req, { expensesService }, ctx) => {
      return ok(await expensesService.create(req, ctx));
    }),

    PUT: withServices(async (req, { expensesService }, ctx) => {
      const { id } = await req.json();
      if (!id) return err('id is required');
      return ok(await expensesService.update(req));
    }),

    DELETE: withServices(async (req, { expensesService }, _ctx) => {
      const { id } = await req.json();
      if (!id) return err('id is required');
      await expensesService.delete(id);
      return ok({ success: true });
    }),
  }
}
