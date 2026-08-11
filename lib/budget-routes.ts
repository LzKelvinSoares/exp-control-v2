import { withAuth, ok, err } from '@/lib/api'

interface BudgetRouteFns<T, TInput> {
  getMany: (userId: string, currency: string, month: number, year: number) => Promise<T[]>
  create: (data: TInput) => Promise<T | T[]>
  update: (id: string, data: Partial<T>) => Promise<T | null>
  remove: (id: string) => Promise<void>
}

export function createBudgetRoutes<T, TInput>(fns: BudgetRouteFns<T, TInput>) {
  return {
    GET: withAuth(async (req, ctx) => {
      const { searchParams } = req.nextUrl
      const month = Number(searchParams.get('month'))
      const year = Number(searchParams.get('year'))
      if (!month || !year) return err('month and year are required')
      return ok(await fns.getMany(ctx.userId, ctx.currency, month, year))
    }),

    POST: withAuth(async (req, ctx) => {
      const body = await req.json()
      return ok(await fns.create({ ...body, userId: ctx.userId, currency: ctx.currency } as TInput))
    }),

    PUT: withAuth(async (req, _ctx) => {
      const { id, ...body } = await req.json()
      if (!id) return err('id is required')
      return ok(await fns.update(id, body as Partial<T>))
    }),

    DELETE: withAuth(async (req, _ctx) => {
      const { id } = await req.json()
      if (!id) return err('id is required')
      await fns.remove(id)
      return ok({ success: true })
    }),
  }
}
