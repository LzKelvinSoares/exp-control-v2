import { withAuth, ok, err } from '@/lib/actions/services/api.service'
import { IFullTableCrudRepository } from '@/types/server-types'
import { getMonthYearParams } from '../services';

export function createBudgetRoutes<T>(repository: IFullTableCrudRepository<T>) {
  return {
    GET: withAuth(async (req, ctx) => {
      const { month, year } = getMonthYearParams(req);
      return ok(await repository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year }))
    }),

    POST: withAuth(async (req, ctx) => {
      const body = await req.json()
      return ok(await repository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency } as T))
    }),

    PUT: withAuth(async (req, _ctx) => {
      const { id, ...body } = await req.json()
      if (!id) return err('id is required')
      return ok(await repository.update(id, body as Partial<T>))
    }),

    DELETE: withAuth(async (req, _ctx) => {
      const { id } = await req.json()
      if (!id) return err('id is required')
      await repository.delete(id)
      return ok({ success: true })
    }),
  }
}
