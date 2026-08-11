'use client'

import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useSession } from 'next-auth/react'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import BillsDueSoon from '@/components/dashboard/BillsDueSoon'
import TrendChart from '@/components/dashboard/TrendChart'
import FuelChart from '@/components/dashboard/FuelChart'
import { useExpenses } from '@/hooks/queries/expenses/use-expenses'
import { useRevenues } from '@/hooks/queries/revenues/use-revenues'
import { useCalendar } from '@/store/calendar'
import { formatCurrency, sumBy } from '@/lib/utils'
import type { Currency } from '@/types'

export default function HomePage() {
  const { month, year } = useCalendar()
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency

  const { data: expenses, isLoading: expLoading } = useExpenses(month, year)
  const { data: revenues, isLoading: revLoading } = useRevenues(month, year)

  const totalExpenses = sumBy(expenses ?? [], 'value')
  const totalRevenues = sumBy(revenues ?? [], 'value')
  const balance = totalRevenues - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Início</h1>
        <MonthYearSelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Despesas"
          value={formatCurrency(totalExpenses, currency)}
          icon={TrendingDown}
          loading={expLoading}
          variant="negative"
        />
        <SummaryCard
          label="Receitas"
          value={formatCurrency(totalRevenues, currency)}
          icon={TrendingUp}
          loading={revLoading}
          variant="positive"
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
