'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import { useBillTableColumns } from './columns/useBillTableColumns'
import { BillTableActions } from './columns/BillTableActions'
import BillModal from './forms/BillModal'
import { useDeleteBill } from '@/hooks/mutations/bills/use-delete-bill'
import { usePayBill } from '@/hooks/mutations/bills/use-pay-bill'
import { usePayBills } from '@/hooks/mutations/bills/use-pay-bills'
import { BILL_CATEGORIES } from '@/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { Bill } from '@/types/app-types'

interface BillTableProps {
  bills: Bill[]
  loading: boolean
}

function isDueSoon(expirationDate: Date | string) {
  const due = new Date(expirationDate)
  const now = new Date()
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 5
}

export default function BillTable({ bills, loading }: BillTableProps) {
  const { currency } = useCurrencySession()
  const deleteBill = useDeleteBill()
  const payBill = usePayBill()
  const payBills = usePayBills()

  const [editing, setEditing] = useState<Bill | undefined>()
  const [cloning, setCloning] = useState<Bill | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function handleClone(b: Bill) {
    setCloning({ ...b, id: undefined, paid: false, paidAt: undefined })
  }

  const unpaidBills = bills.filter((b) => !b.paid)
  const allSelected = unpaidBills.length > 0 && unpaidBills.every((b) => selected.has(String(b.id)))

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(unpaidBills.map((b) => String(b.id))))
  }

  async function handlePaySelected() {
    if (!selected.size) return
    try {
      await payBills.mutateAsync([...selected])
      toast.success(`${selected.size} conta(s) paga(s)`)
      setSelected(new Set())
    } catch {
      toast.error('Erro ao pagar contas')
    }
  }

  async function handlePayOne(id: string) {
    try {
      await payBill.mutateAsync(id)
      toast.success('Conta paga')
    } catch {
      toast.error('Erro ao pagar conta')
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteBill.mutateAsync(deletingId)
      toast.success('Conta excluída')
    } catch {
      toast.error('Erro ao excluir')
    } finally {
      setDeletingId(null)
    }
  }

  function getCategoryLabel(value: string) {
    return BILL_CATEGORIES.find((c) => c.value === value)?.label ?? value
  }

  const columns = useBillTableColumns({
    currency,
    selected,
    allSelected,
    isPaying: payBill.isPending,
    onToggleAll: toggleAll,
    onToggleSelect: toggleSelect,
    onEdit: setEditing,
    onClone: handleClone,
    onDelete: setDeletingId,
    onPay: handlePayOne,
  })

  return (
    <>
      {selected.size > 0 && (
        <div className='flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800'>
          <span className='text-sm text-emerald-700 dark:text-emerald-400'>{selected.size} selecionada(s)</span>
          <Button size='sm' variant='outline' className='text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700' onClick={handlePaySelected} disabled={payBills.isPending}>
            <CheckCircle2 size={14} className='mr-1' />
            {payBills.isPending ? 'Pagando...' : 'Pagar selecionadas'}
          </Button>
        </div>
      )}

      <DataTable
        data={bills}
        columns={columns}
        keyExtractor={(b) => String(b.id)}
        loading={loading}
        emptyMessage="Nenhuma conta cadastrada"
        rowClassName={(b) => !b.paid && isDueSoon(b.expirationDate) ? 'bg-amber-50 dark:bg-amber-950/30' : undefined}
        renderCard={(b) => {
          const id = String(b.id)
          const dueSoon = !b.paid && isDueSoon(b.expirationDate)
          return (
            <DataCard
              className={dueSoon ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : undefined}
              primary={
                <div className="flex items-center gap-2 min-w-0">
                  {!b.paid && <Checkbox checked={selected.has(id)} onCheckedChange={() => toggleSelect(id)} />}
                  <span className="font-medium text-sm truncate">{b.description}</span>
                </div>
              }
              value={<span className="font-semibold text-sm">{formatCurrency(b.value, currency)}</span>}
              meta={
                <>
                  <Badge variant="outline" className="text-xs">{getCategoryLabel(b.type)}</Badge>
                  {b.paid
                    ? <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs">Pago</Badge>
                    : <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">Pendente</Badge>
                  }
                  <span className={`text-xs ${dueSoon ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-muted-foreground'}`}>
                    Vence: {formatDate(b.expirationDate)}{dueSoon && ' ⚠'}
                  </span>
                </>
              }
              actions={
                <BillTableActions
                  bill={b}
                  onEdit={setEditing}
                  onClone={handleClone}
                  onDelete={setDeletingId}
                  onPay={handlePayOne}
                  isPaying={payBill.isPending}
                />
              }
            />
          )
        }}
      />

      <BillModal open={!!editing} bill={editing} onClose={() => setEditing(undefined)} key={editing?.id}/>
      <BillModal open={!!cloning} bill={cloning} onClose={() => setCloning(undefined)} key={cloning?.description}/>

      <ConfirmDialog
        open={!!deletingId}
        loading={deleteBill.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  )
}
