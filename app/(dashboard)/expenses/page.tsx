'use client'

import { useState } from 'react'
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
import { useCurrencySession } from '@/hooks/use-currency-session'
import { PageWrapper } from '@/components/shared/PageWrapper'

export default function ExpensesPage() {
  const { month, year } = useCalendar()
  const { currency } = useCurrencySession()

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
    <PageWrapper title='Despesas' addItem='Nova despesa' setAddModalOpen={setModalOpen}>
      <SummaryCard
        label='Total de despesas'
        value={formatCurrency(total, currency)}
        icon={TrendingDown}
        loading={isLoading}
        variant='negative'
        breakdown={categoryBreakdown}
      />

      <TableFilters defs={EXPENSE_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <ExpenseTable expenses={filteredData} loading={isLoading} />

      <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageWrapper>
  )
}
