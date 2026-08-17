import { withAuth, ok, err } from '@/lib/api'
import { IFullTableCrudService, IGetByMonthAndYearProps } from '@/types/server-types'

export function createBudgetRoutes<T>(service: IFullTableCrudService<T>) {
  return {
    GET: withAuth(async (req, ctx) => {
      const { searchParams } = req.nextUrl
      const month = Number(searchParams.get('month'))
      const year = Number(searchParams.get('year'))
      if (!month || !year) return err('month and year are required')
      return ok(await service.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year }))
    }),

    POST: withAuth(async (req, ctx) => {
      const body = await req.json()
      return ok(await service.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency } as T))
    }),

    PUT: withAuth(async (req, _ctx) => {
      const { id, ...body } = await req.json()
      if (!id) return err('id is required')
      return ok(await service.update(id, body as Partial<T>))
    }),

    DELETE: withAuth(async (req, _ctx) => {
      const { id } = await req.json()
      if (!id) return err('id is required')
      await service.delete(id)
      return ok({ success: true })
    }),
  }
}
