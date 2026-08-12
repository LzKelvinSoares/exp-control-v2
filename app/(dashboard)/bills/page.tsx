'use client'

import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import SummaryCard from '@/components/shared/SummaryCard'
import BillTable from '@/components/bills/BillTable'
import BillModal from '@/components/bills/BillModal'
import { useBills } from '@/hooks/queries/bills/use-bills'
import { formatCurrency, sumBy } from '@/lib/utils'
import { useCalendar } from '@/store/calendar'
import { useSession } from 'next-auth/react'
import type { Currency } from '@/types'

export default function BillsPage() {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const { month, year } = useCalendar()

  const { data: bills = [], isLoading } = useBills(month, year)
  const [modalOpen, setModalOpen] = useState(false)

  const unpaid = bills.filter((b) => !b.paid)
  const totalUnpaid = sumBy(unpaid, 'value')
  const totalAll = sumBy(bills, 'value')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Contas</h1>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <MonthYearSelector />
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" /> Nova conta
          </Button>
        </div>
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
