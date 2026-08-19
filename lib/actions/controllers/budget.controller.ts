import { ok, err } from '@/lib/actions/services/api.service'
import { ITableCrudService } from '@/types/server-types';
import { withAuth } from '../middlewares';

export function createBudgetRoutes<T>(service: ITableCrudService<T>) {
  return {
    GET: withAuth(async (req, ctx) => {
      return ok(await service.get(req, ctx));
    }),

    POST: withAuth(async (req, ctx) => {
      return ok(await service.create(req, ctx));
    }),

    PUT: withAuth(async (req, _ctx) => {
      const { id } = await req.json();
      if (!id) return err('id is required');
      return ok(await service.update(req));
    }),

    DELETE: withAuth(async (req, _ctx) => {
      const { id } = await req.json();
      if (!id) return err('id is required');
      await service.delete(id);
      return ok({ success: true });
    }),
  }
}
