import { withAuth, ok } from '@/lib/api'
import { getExpensesByYear, getRevenuesByYear, getFuelByYear } from '@/lib/db'
import { MONTHS } from '@/constants'
import type { MonthlyChartData } from '@/types'

export const GET = withAuth(async (req, ctx) => {
  const year = Number(req.nextUrl.searchParams.get('year')) || new Date().getFullYear()

  const [expenses, revenues, fuel] = await Promise.all([
    getExpensesByYear(ctx.userId, ctx.currency, year),
    getRevenuesByYear(ctx.userId, ctx.currency, year),
    getFuelByYear(ctx.userId, ctx.currency, year),
  ])

  const data: MonthlyChartData[] = MONTHS.map(({ value, short }) => {
    const monthExpenses = expenses
      .filter((e) => new Date(e.firstExpirationDate as string).getMonth() + 1 === value)
      .reduce((sum, e) => sum + Number(e.value), 0)

    const monthFuel = fuel
      .filter((f) => new Date(f.creationDate).getMonth() + 1 === value)
      .reduce((sum, f) => sum + Number(f.value), 0)

    const monthRevenues = revenues
      .filter((r) => new Date(r.firstExpirationDate as string).getMonth() + 1 === value)
      .reduce((sum, r) => sum + Number(r.value), 0)

    return {
      month: short,
      expenses: monthExpenses + monthFuel,
      revenues: monthRevenues,
      fuel: monthFuel,
    }
  })

  return ok(data)
})
