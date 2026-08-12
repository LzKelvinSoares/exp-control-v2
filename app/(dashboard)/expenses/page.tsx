'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import ExpenseModal from '@/components/expenses/ExpenseModal'
import { useExpenses } from '@/hooks/queries/expenses/use-expenses'
import { useCalendar } from '@/store/calendar'
import { formatCurrency, sumBy } from '@/lib/utils'
import { TrendingDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function ExpensesPage() {
  const { month, year } = useCalendar()
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency

  const { data: expenses = [], isLoading } = useExpenses(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const total = sumBy(expenses, 'value')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Despesas</h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <MonthYearSelector />
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" /> Nova despesa
          </Button>
        </div>
      </div>

      <SummaryCard
        label="Total de despesas"
        value={formatCurrency(total, currency)}
        icon={TrendingDown}
        loading={isLoading}
        variant="negative"
      />

      <ExpenseTable expenses={expenses} loading={isLoading} />

      <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
