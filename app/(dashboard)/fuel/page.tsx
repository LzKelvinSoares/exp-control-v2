'use client'

import { useState } from 'react'
import { Fuel } from 'lucide-react'
import SummaryCard from '@/components/shared/SummaryCard'
import { TableFilters } from '@/components/shared/TableFilters'
import FuelTable from '@/components/fuel/FuelTable'
import FuelModal from '@/components/fuel/forms/FuelModal'
import { useFuel } from '@/hooks/queries/fuel/use-fuel'
import { useTableFilter } from '@/hooks/useTableFilter'
import { formatCurrency } from '@/lib/utils'
import { FUEL_FILTER_DEFS } from '@/constants'
import { useCalendar } from '@/store/calendar'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { PageWrapper } from '@/components/shared/PageWrapper'

export default function FuelPage() {
  const { currency } = useCurrencySession()
  const { month, year } = useCalendar()

  const { data: entries = [], isLoading } = useFuel(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(entries, FUEL_FILTER_DEFS)

  const totalCost = filteredData.reduce((acc, e) => acc + Number(e.value), 0)
  const totalLiters = filteredData.reduce((acc, e) => acc + Number(e.value) / Number(e.valuePerLiter), 0)

  return (
    <PageWrapper title='Combustível' addItem='Nova entrada' setAddModalOpen={setModalOpen}>
      <div className='grid grid-cols-2 gap-4'>
        <SummaryCard
          label='Total gasto'
          value={formatCurrency(totalCost, currency)}
          icon={Fuel}
          loading={isLoading}
          variant='negative'
        />
        <SummaryCard
          label='Total em litros'
          value={`${totalLiters.toFixed(3)} L`}
          icon={Fuel}
          loading={isLoading}
        />
      </div>

      <TableFilters defs={FUEL_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <FuelTable entries={filteredData} loading={isLoading} />

      <FuelModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageWrapper>
  )
}
