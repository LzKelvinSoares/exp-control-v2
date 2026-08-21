import { ok, executeUpdateWithIdValidation, executeDeleteWithIdValidation } from '@/lib/actions/services/api.service'
import { withServices } from '../middlewares';

export function createExpensesRoutes() {
  return {
    GET: withServices(async (req, ctx, { expensesService }) => {
      return ok(await expensesService.get(req, ctx));
    }),

    POST: withServices(async (req, ctx, { expensesService }) => {
      return ok(await expensesService.create(req, ctx));
    }),

    PUT: withServices(async (req, ctx, { expensesService }) => {
      return executeUpdateWithIdValidation(req, ctx, expensesService);
    }),

    DELETE: withServices(async (req, ctx, { expensesService }) => {
      return executeDeleteWithIdValidation(req, ctx, expensesService);
    }),
  }
}
