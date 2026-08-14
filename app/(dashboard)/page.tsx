'use client'

import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import BillsDueSoon from '@/components/dashboard/BillsDueSoon'
import TrendChart from '@/components/dashboard/TrendChart'
import FuelChart from '@/components/dashboard/FuelChart'
import { useExpenses } from '@/hooks/queries/expenses/use-expenses'
import { useRevenues } from '@/hooks/queries/revenues/use-revenues'
import { useCalendar } from '@/store/calendar'
import { formatCurrency, sumBy } from '@/lib/utils'
import { EXPENSE_CATEGORIES, REVENUE_CATEGORIES } from '@/constants'
import { useCurrencySession } from '@/hooks/use-currency-session'

export default function HomePage() {
  const { month, year } = useCalendar()
  const { currency } = useCurrencySession()

  const { data: expenses, isLoading: expLoading } = useExpenses(month, year)
  const { data: revenues, isLoading: revLoading } = useRevenues(month, year)

  const totalExpenses = sumBy(expenses ?? [], 'value')
  const totalRevenues = sumBy(revenues ?? [], 'value')
  const balance = totalRevenues - totalExpenses

  const expenseBreakdown = EXPENSE_CATEGORIES
    .map((cat) => ({
      label: cat.label,
      value: sumBy((expenses ?? []).filter((e) => e.type === cat.value), 'value'),
    }))
    .filter((c) => c.value > 0)
    .map((c) => ({ label: c.label, value: formatCurrency(c.value, currency) }))

  const revenueBreakdown = REVENUE_CATEGORIES
    .map((cat) => ({
      label: cat.label,
      value: sumBy((revenues ?? []).filter((r) => r.type === cat.value), 'value'),
    }))
    .filter((c) => c.value > 0)
    .map((c) => ({ label: c.label, value: formatCurrency(c.value, currency) }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Início</h1>
        <MonthYearSelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Despesas"
          value={formatCurrency(totalExpenses, currency)}
          icon={TrendingDown}
          loading={expLoading}
          variant="negative"
          breakdown={expenseBreakdown}
        />
        <SummaryCard
          label="Receitas"
          value={formatCurrency(totalRevenues, currency)}
          icon={TrendingUp}
          loading={revLoading}
          variant="positive"
          breakdown={revenueBreakdown}
        />
        <SummaryCard
          label="Saldo"
          value={formatCurrency(balance, currency)}
          icon={Wallet}
          loading={expLoading || revLoading}
          variant={balance >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <BillsDueSoon />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart />
        <FuelChart />
      </div>
    </div>
  )
}
