'use client'

import { useState } from 'react'
import { Plus, Fuel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import FuelTable from '@/components/fuel/FuelTable'
import FuelModal from '@/components/fuel/FuelModal'
import { useFuel } from '@/hooks/queries/fuel/use-fuel'
import { formatCurrency } from '@/lib/utils'
import { useCalendar } from '@/store/calendar'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function FuelPage() {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const { month, year } = useCalendar()

  const { data: entries = [], isLoading } = useFuel(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const totalCost = entries.reduce((acc, e) => acc + Number(e.value), 0)
  const totalLiters = entries.reduce((acc, e) => acc + Number(e.value) / Number(e.valuePerLiter), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Combustível</h1>
        <div className="flex items-center gap-3">
          <MonthYearSelector />
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" /> Novo abastecimento
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

      <FuelTable entries={entries} loading={isLoading} />

      <FuelModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
