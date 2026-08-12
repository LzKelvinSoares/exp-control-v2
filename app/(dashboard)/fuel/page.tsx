'use client'

import { useState } from 'react'
import { Plus, Fuel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import { TableFilters } from '@/components/shared/TableFilters'
import FuelTable from '@/components/fuel/FuelTable'
import FuelModal from '@/components/fuel/forms/FuelModal'
import { useFuel } from '@/hooks/queries/fuel/use-fuel'
import { useTableFilter } from '@/hooks/useTableFilter'
import { formatCurrency } from '@/lib/utils'
import { FUEL_FILTER_DEFS } from '@/constants'
import { useCalendar } from '@/store/calendar'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function FuelPage() {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const { month, year } = useCalendar()

  const { data: entries = [], isLoading } = useFuel(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(entries, FUEL_FILTER_DEFS)

  const totalCost = filteredData.reduce((acc, e) => acc + Number(e.value), 0)
  const totalLiters = filteredData.reduce((acc, e) => acc + Number(e.value) / Number(e.valuePerLiter), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Combustível</h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <MonthYearSelector />
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            <span className="hidden sm:inline ml-1">Novo abastecimento</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SummaryCard
          label="Total gasto"
          value={formatCurrency(totalCost, currency)}
          icon={Fuel}
          loading={isLoading}
          variant="negative"
        />
        <SummaryCard
          label="Total em litros"
          value={`${totalLiters.toFixed(3)} L`}
          icon={Fuel}
          loading={isLoading}
        />
      </div>

      <TableFilters defs={FUEL_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <FuelTable entries={filteredData} loading={isLoading} />

      <FuelModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
