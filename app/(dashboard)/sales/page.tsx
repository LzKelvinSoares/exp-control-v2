'use client'

import { useState } from 'react'
import { Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SummaryCard from '@/components/shared/SummaryCard'
import { TableFilters } from '@/components/shared/TableFilters'
import SaleTable from '@/components/sales/SaleTable'
import SaleModal from '@/components/sales/forms/SaleModal'
import { useSales } from '@/hooks/queries/sales/use-sales'
import { useTableFilter } from '@/hooks/useTableFilter'
import { formatCurrency, sumBy } from '@/lib/utils'
import { SALE_FILTER_DEFS } from '@/constants'
import { useCurrencySession } from '@/hooks/use-currency-session'

export default function SalesPage() {
  const { currency } = useCurrencySession()

  const { data: sales = [], isLoading } = useSales()
  const [modalOpen, setModalOpen] = useState(false)

  const { filteredData, filterValues, setFilter, clearFilters, hasActiveFilters } = useTableFilter(sales, SALE_FILTER_DEFS)

  const totalValue = sumBy(filteredData, 'value')
  const pendingCount = filteredData.filter((s) => !s.paid).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          <span className="hidden sm:inline ml-1">Nova venda</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SummaryCard
          label="Total em vendas"
          value={formatCurrency(totalValue, currency)}
          icon={ShoppingBag}
          loading={isLoading}
          variant="positive"
        />
        <SummaryCard
          label="Pagamentos pendentes"
          value={String(pendingCount)}
          icon={ShoppingBag}
          loading={isLoading}
          variant={pendingCount > 0 ? 'negative' : 'default'}
        />
      </div>

      <TableFilters defs={SALE_FILTER_DEFS} values={filterValues} hasActive={hasActiveFilters} onFilter={setFilter} onClear={clearFilters} />

      <SaleTable sales={filteredData} loading={isLoading} />

      <SaleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
