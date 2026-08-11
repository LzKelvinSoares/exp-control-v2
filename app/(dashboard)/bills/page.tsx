'use client'

import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SummaryCard from '@/components/shared/SummaryCard'
import BillTable from '@/components/bills/BillTable'
import BillModal from '@/components/bills/BillModal'
import { useBills } from '@/hooks/queries/bills/use-bills'
import { formatCurrency, sumBy } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function BillsPage() {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency

  const { data: bills = [], isLoading } = useBills()
  const [modalOpen, setModalOpen] = useState(false)

  const unpaid = bills.filter((b) => !b.paid)
  const totalUnpaid = sumBy(unpaid, 'value')
  const totalAll = sumBy(bills, 'value')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Contas</h1>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={16} className="mr-1" /> Nova conta
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SummaryCard
          label="Total em aberto"
          value={formatCurrency(totalUnpaid, currency)}
          icon={Receipt}
          loading={isLoading}
          variant="negative"
        />
        <SummaryCard
          label="Total geral"
          value={formatCurrency(totalAll, currency)}
          icon={Receipt}
          loading={isLoading}
        />
      </div>

      <BillTable bills={bills} loading={isLoading} />

      <BillModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
