'use client'

import { useState } from 'react'
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import BillModal from './BillModal'
import { useDeleteBill } from '@/hooks/mutations/bills/use-delete-bill'
import { usePayBill } from '@/hooks/mutations/bills/use-pay-bill'
import { usePayBills } from '@/hooks/mutations/bills/use-pay-bills'
import { BILL_CATEGORIES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Bill, Currency } from '@/types'

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

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export default function BillTable({ bills, loading }: BillTableProps) {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const deleteBill = useDeleteBill()
  const payBill = usePayBill()
  const payBills = usePayBills()

  const [editing, setEditing] = useState<Bill | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function getCategoryLabel(value: string) {
    return BILL_CATEGORIES.find((c) => c.value === value)?.label ?? value
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const unpaidBills = bills.filter((b) => !b.paid)
  const allSelected = unpaidBills.length > 0 && unpaidBills.every((b) => selected.has(String(b.id)))

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

  function renderActions(bill: Bill) {
    const id = String(bill.id)
    return (
      <>
        {!bill.paid && (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600" onClick={() => handlePayOne(id)} disabled={payBill.isPending}>
            <CheckCircle2 size={13} />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(bill)}>
          <Pencil size={13} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(id)}>
          <Trash2 size={13} />
        </Button>
      </>
    )
  }

  const columns: ColumnDef<Bill>[] = [
    {
      header: <Checkbox checked={allSelected} onCheckedChange={toggleAll} />,
      headerClassName: 'w-10',
      cell: (b) => !b.paid
        ? <Checkbox checked={selected.has(String(b.id))} onCheckedChange={() => toggleSelect(String(b.id))} />
        : null,
    },
    {
      header: 'Nome',
      cell: (b) => <span className="font-medium">{b.description}</span>,
    },
    {
      header: 'Categoria',
      cell: (b) => <Badge variant="outline" className="text-xs">{getCategoryLabel(b.type)}</Badge>,
    },
    {
      header: 'Vencimento',
      cell: (b) => {
        const dueSoon = !b.paid && isDueSoon(b.expirationDate)
        return (
          <span className={`text-sm ${dueSoon ? 'text-amber-700 font-medium' : 'text-muted-foreground'}`}>
            {formatDate(b.expirationDate)}{dueSoon && ' ⚠'}
          </span>
        )
      },
    },
    {
      header: 'Status',
      cell: (b) => b.paid
        ? <Badge className="bg-emerald-100 text-emerald-700 text-xs">Pago</Badge>
        : <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">Pendente</Badge>,
    },
    {
      header: 'Valor',
      headerClassName: 'text-right',
      className: 'text-right font-semibold',
      cell: (b) => formatCurrency(b.value, currency),
    },
    {
      header: '',
      headerClassName: 'w-24',
      cell: (b) => <div className="flex items-center gap-1 justify-end">{renderActions(b)}</div>,
    },
  ]

  return (
    <>
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <span className="text-sm text-emerald-700">{selected.size} selecionada(s)</span>
          <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-300" onClick={handlePaySelected} disabled={payBills.isPending}>
            <CheckCircle2 size={14} className="mr-1" />
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
        rowClassName={(b) => !b.paid && isDueSoon(b.expirationDate) ? 'bg-amber-50' : undefined}
        renderCard={(b) => {
          const id = String(b.id)
          const dueSoon = !b.paid && isDueSoon(b.expirationDate)
          return (
            <DataCard
              className={dueSoon ? 'bg-amber-50 border-amber-200' : undefined}
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
                    ? <Badge className="bg-emerald-100 text-emerald-700 text-xs">Pago</Badge>
                    : <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">Pendente</Badge>
                  }
                  <span className={`text-xs ${dueSoon ? 'text-amber-700 font-medium' : 'text-muted-foreground'}`}>
                    Vence: {formatDate(b.expirationDate)}{dueSoon && ' ⚠'}
                  </span>
                </>
              }
              actions={renderActions(b)}
            />
          )
        }}
      />

      <BillModal open={!!editing} bill={editing} onClose={() => setEditing(undefined)} />

      <ConfirmDialog
        open={!!deletingId}
        loading={deleteBill.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  )
}
