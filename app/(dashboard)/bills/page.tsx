'use client'

import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import { TableFilters } from '@/components/shared/TableFilters'
import BillTable from '@/components/bills/BillTable'
import BillModal from '@/components/bills/forms/BillModal'
import GoogleCalendarBanner from '@/components/bills/GoogleCalendarBanner'
import { useBills } from '@/hooks/queries/bills/use-bills'
import { useTableFilter } from '@/hooks/useTableFilter'
import { formatCurrency, sumBy } from '@/lib/utils'
import { BILL_FILTER_DEFS } from '@/constants'
import { useCalendar } from '@/store/calendar'
import { useCurrencySession } from '@/hooks/use-currency-session'

export default function BillsPage() {
  const { currency } = useCurrencySession()
  const { month, year } = useCalendar()

  const { data: bills = [], isLoading } = useBills(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(bills, BILL_FILTER_DEFS)

  const unpaid = filteredData.filter((b) => !b.paid)
  const totalUnpaid = sumBy(unpaid, 'value')
  const totalAll = sumBy(filteredData, 'value')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Contas</h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <MonthYearSelector />
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            <span className="hidden sm:inline ml-1">Nova conta</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SummaryCard
          label="Total em aberto"
          value={formatCurrency(totalUnpaid, currency)}
          icon={Receipt}
          loading={isLoading}
          variant="negative"
        />
        <SummaryCard
          label="Total geral"
          value={formatCurrency(totalAll, currency)}
          icon={Receipt}
          loading={isLoading}
        />
      </div>

      <GoogleCalendarBanner />

      <TableFilters defs={BILL_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <BillTable bills={filteredData} loading={isLoading} />

      <BillModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
