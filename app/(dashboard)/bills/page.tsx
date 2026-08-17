'use client'

import { useState } from 'react'
import { Receipt } from 'lucide-react'
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
import { PageWrapper } from '@/components/shared/PageWrapper'

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
    <PageWrapper title='Contas' addItem='Nova conta' setAddModalOpen={setModalOpen}>
      <div className='grid grid-cols-2 gap-4'>
        <SummaryCard
          label='Total em aberto'
          value={formatCurrency(totalUnpaid, currency)}
          icon={Receipt}
          loading={isLoading}
          variant='negative'
        />
        <SummaryCard
          label='Total geral'
          value={formatCurrency(totalAll, currency)}
          icon={Receipt}
          loading={isLoading}
        />
      </div>

      <GoogleCalendarBanner />

      <TableFilters defs={BILL_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <BillTable bills={filteredData} loading={isLoading} />

      <BillModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageWrapper>
  )
}
