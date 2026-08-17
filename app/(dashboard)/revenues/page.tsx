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
import { REVENUE_CATEGORIES, REVENUE_FILTER_DEFS } from '@/constants'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { PageWrapper } from '@/components/shared/PageWrapper'

export default function RevenuesPage() {
  const { month, year } = useCalendar();
    const { currency } = useCurrencySession();

  const { data: revenues = [], isLoading } = useRevenues(month, year);
  const [modalOpen, setModalOpen] = useState(false);

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(revenues, REVENUE_FILTER_DEFS);

  const total = sumBy(filteredData, 'value');

  const categoryBreakdown = REVENUE_CATEGORIES
    .map((cat) => ({
      label: cat.label,
      value: sumBy(filteredData.filter((r) => r.type === cat.value), 'value'),
    }))
    .filter((c) => c.value > 0)
    .map((c) => ({ label: c.label, value: formatCurrency(c.value, currency) }));

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
  };

  const RenderShareButton = () => {
    return (
      <Button 
        size='sm' 
        variant='outline' 
        onClick={handleShare}
        disabled={filteredData.length === 0}
      >
        <Share2 size={16} />
        <span className='hidden sm:inline ml-1'>Compartilhar</span>
      </Button>
    )
  }

  return (
    <PageWrapper title='Receitas' 
        addItem='Nova receita' 
        setAddModalOpen={setModalOpen} 
        secondaryActions={<RenderShareButton />}
      >
      <SummaryCard
        label='Total de receitas'
        value={formatCurrency(total, currency)}
        icon={TrendingUp}
        loading={isLoading}
        variant='positive'
        breakdown={categoryBreakdown}
      />

      <TableFilters defs={REVENUE_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <RevenueTable revenues={filteredData} loading={isLoading} />

      <RevenueModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageWrapper>
  )
}
