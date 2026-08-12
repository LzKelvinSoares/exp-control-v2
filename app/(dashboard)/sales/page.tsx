'use client'

import { useState } from 'react'
import { Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SummaryCard from '@/components/shared/SummaryCard'
import SaleTable from '@/components/sales/SaleTable'
import SaleModal from '@/components/sales/SaleModal'
import { useSales } from '@/hooks/queries/sales/use-sales'
import { formatCurrency, sumBy } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function SalesPage() {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency

  const { data: sales = [], isLoading } = useSales()
  const [modalOpen, setModalOpen] = useState(false)

  const totalValue = sumBy(sales, 'value')
  const pendingCount = sales.filter((s) => !s.paid).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Vendas</h1>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-1" /> Nova venda
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

      <SaleTable sales={sales} loading={isLoading} />

      <SaleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
