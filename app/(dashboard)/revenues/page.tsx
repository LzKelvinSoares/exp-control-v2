'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import RevenueTable from '@/components/revenues/RevenueTable'
import RevenueModal from '@/components/revenues/RevenueModal'
import { useRevenues } from '@/hooks/queries/revenues/use-revenues'
import { useCalendar } from '@/store/calendar'
import { formatCurrency, sumBy } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function RevenuesPage() {
  const { month, year } = useCalendar()
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency

  const { data: revenues = [], isLoading } = useRevenues(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const total = sumBy(revenues, 'value')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Receitas</h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <MonthYearSelector />
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" /> Nova receita
          </Button>
        </div>
      </div>

      <SummaryCard
        label="Total de receitas"
        value={formatCurrency(total, currency)}
        icon={TrendingUp}
        loading={isLoading}
        variant="positive"
      />

      <RevenueTable revenues={revenues} loading={isLoading} />

      <RevenueModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
