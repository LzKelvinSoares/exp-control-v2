'use client'

import { useState } from 'react'
import { Share2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SummaryCard from '@/components/shared/SummaryCard'
import { TableFilters } from '@/components/shared/TableFilters'
import SaleTable from '@/components/sales/SaleTable'
import SaleModal from '@/components/sales/forms/SaleModal'
import { useSales } from '@/hooks/queries/sales/use-sales'
import { useTableFilter } from '@/hooks/useTableFilter'
import { formatCurrency, shareOrCopy, sumBy } from '@/lib/utils'
import { toast } from 'sonner'
import { SALE_FILTER_DEFS } from '@/constants'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { PageWrapper } from '@/components/shared/PageWrapper'

export function SalesView() {
  const { currency } = useCurrencySession()

  const { data: sales = [], isLoading } = useSales()
  const [modalOpen, setModalOpen] = useState(false)

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(sales, SALE_FILTER_DEFS)

  const totalValue = sumBy(filteredData, 'value')
  const pendingCount = filteredData.filter((s) => !s.paid).length

  async function handleShare() {
    const text = filteredData
      .map((sale) => {
        const value = formatCurrency(sale.value, currency).replace(/ /g, ' ')
        const date = sale.saleDate ? ` - ${new Date(sale.saleDate).toLocaleDateString('pt-BR')}` : ''
        return `${sale.description} - ${value}${date}`
      })
      .join('\n')

    try {
      const result = await shareOrCopy({ title: 'Vendas', text })
      if (result === 'copied') toast.success('Vendas copiadas para a área de transferência')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error('Não foi possível compartilhar as vendas')
    }
  }

  const shareButton = (
    <Button size='sm' variant='outline' onClick={handleShare} disabled={filteredData.length === 0}>
      <Share2 size={16} />
      <span className='hidden sm:inline ml-1'>Compartilhar</span>
    </Button>
  )

  return (
    <PageWrapper
      title='Vendas'
      addItem='Nova venda'
      setAddModalOpen={setModalOpen}
      hideMonthYearSelector
      secondaryActions={shareButton}
    >
      <div className='grid grid-cols-2 gap-4'>
        <SummaryCard
          label='Total em vendas'
          value={formatCurrency(totalValue, currency)}
          icon={ShoppingBag}
          loading={isLoading}
          variant='positive'
        />
        <SummaryCard
          label='Pagamentos pendentes'
          value={String(pendingCount)}
          icon={ShoppingBag}
          loading={isLoading}
          variant={pendingCount > 0 ? 'negative' : 'default'}
        />
      </div>

      <TableFilters defs={SALE_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <SaleTable sales={filteredData} loading={isLoading} />

      <SaleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageWrapper>
  )
}
