'use client'

import { useState } from 'react'
import { Plus, Share2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import { TableFilters } from '@/components/shared/TableFilters'
import RevenueTable from '@/components/revenues/RevenueTable'
import RevenueModal from '@/components/revenues/forms/RevenueModal'
import { useRevenues } from '@/hooks/queries/revenues/use-revenues'
import { useTableFilter } from '@/hooks/useTableFilter'
import { useCalendar } from '@/store/calendar'
import { formatCurrency, sumBy } from '@/lib/utils'
import { REVENUE_FILTER_DEFS } from '@/constants'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function RevenuesPage() {
  const { month, year } = useCalendar()
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency

  const { data: revenues = [], isLoading } = useRevenues(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(revenues, REVENUE_FILTER_DEFS)

  const total = sumBy(filteredData, 'value')

  function handleShare() {
    if (typeof navigator === 'undefined' || !navigator.share) return
    const text = filteredData
      .map((r) => {
        const value = formatCurrency(r.value, currency).replace(/ /g, ' ')
        const line = `${r.description} - ${value}`
        return r.monthsLeft && r.monthsLeft > 1 ? `${line} - Faltam: ${r.monthsLeft}` : line
      })
      .join('\n')
    navigator.share({ title: 'Receitas', text })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Receitas</h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <MonthYearSelector />
          {filteredData.length > 0 && (
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 size={16} className="mr-1" /> Compartilhar
            </Button>
          )}
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

      <TableFilters defs={REVENUE_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <RevenueTable revenues={filteredData} loading={isLoading} />

      <RevenueModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
