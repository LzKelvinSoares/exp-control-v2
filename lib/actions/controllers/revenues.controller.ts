import { ok, err, executeUpdateWithIdValidation, executeDeleteWithIdValidation } from '@/lib/actions/services/api.service'
import { withServices } from '../middlewares';

export function createRevenuesRoutes() {
  return {
    GET: withServices(async (req, ctx, { revenuesService }) => {
      return ok(await revenuesService.get(req, ctx));
    }),

    POST: withServices(async (req, ctx, { revenuesService }) => {
      return ok(await revenuesService.create(req, ctx));
    }),

    PUT: withServices(async (req, ctx, { revenuesService }) => {
      return executeUpdateWithIdValidation(req, ctx, revenuesService);
    }),

    DELETE: withServices(async (req, ctx, { revenuesService }) => {
      return executeDeleteWithIdValidation(req, ctx, revenuesService);
    }),
  }
}
