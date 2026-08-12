'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import { TableFilters } from '@/components/shared/TableFilters'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import ExpenseModal from '@/components/expenses/forms/ExpenseModal'
import { useExpenses } from '@/hooks/queries/expenses/use-expenses'
import { useTableFilter } from '@/hooks/useTableFilter'
import { useCalendar } from '@/store/calendar'
import { formatCurrency, sumBy } from '@/lib/utils'
import { EXPENSE_CATEGORIES, EXPENSE_FILTER_DEFS } from '@/constants'
import { TrendingDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function ExpensesPage() {
  const { month, year } = useCalendar()
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency

  const { data: expenses = [], isLoading } = useExpenses(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(expenses, EXPENSE_FILTER_DEFS)

  const total = sumBy(filteredData, 'value')

  const categoryBreakdown = EXPENSE_CATEGORIES
    .map((cat) => ({
      label: cat.label,
      value: sumBy(filteredData.filter((e) => e.type === cat.value), 'value'),
    }))
    .filter((c) => c.value > 0)
    .map((c) => ({ label: c.label, value: formatCurrency(c.value, currency) }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Despesas</h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <MonthYearSelector />
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            <span className="hidden sm:inline ml-1">Nova despesa</span>
          </Button>
        </div>
      </div>

      <SummaryCard
        label="Total de despesas"
        value={formatCurrency(total, currency)}
        icon={TrendingDown}
        loading={isLoading}
        variant="negative"
        breakdown={categoryBreakdown}
      />

      <TableFilters defs={EXPENSE_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <ExpenseTable expenses={filteredData} loading={isLoading} />

      <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
