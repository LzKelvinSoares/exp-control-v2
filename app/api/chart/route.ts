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
      .filter((e) => e.month === value)
      .reduce((sum, e) => sum + e.value, 0)

    const monthFuel = fuel
      .filter((f) => new Date(f.date).getMonth() + 1 === value)
      .reduce((sum, f) => sum + f.totalCost, 0)

    const monthRevenues = revenues
      .filter((r) => r.month === value)
      .reduce((sum, r) => sum + r.value, 0)

    return {
      month: short,
      expenses: monthExpenses + monthFuel,
      revenues: monthRevenues,
      fuel: monthFuel,
    }
  })

  return ok(data)
})
