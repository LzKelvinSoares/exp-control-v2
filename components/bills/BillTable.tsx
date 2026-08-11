'use client'

import { useState } from 'react'
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
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

function isDueSoon(dueDate: Date | string) {
  const due = new Date(dueDate)
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
  const allSelected = unpaidBills.length > 0 && unpaidBills.every((b) => selected.has(String(b._id)))

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(unpaidBills.map((b) => String(b._id))))
    }
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

  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  )

  if (!bills.length) return (
    <p className="text-sm text-muted-foreground text-center py-10">
      Nenhuma conta cadastrada
    </p>
  )

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            </TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => {
            const id = String(bill._id)
            const dueSoon = !bill.paid && isDueSoon(bill.dueDate)
            return (
              <TableRow key={id} className={dueSoon ? 'bg-amber-50' : undefined}>
                <TableCell>
                  {!bill.paid && (
                    <Checkbox checked={selected.has(id)} onCheckedChange={() => toggleSelect(id)} />
                  )}
                </TableCell>
                <TableCell className="font-medium">{bill.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{getCategoryLabel(bill.category)}</Badge>
                </TableCell>
                <TableCell className={`text-sm ${dueSoon ? 'text-amber-700 font-medium' : 'text-muted-foreground'}`}>
                  {formatDate(bill.dueDate)}
                  {dueSoon && ' ⚠'}
                </TableCell>
                <TableCell>
                  {bill.paid
                    ? <Badge className="bg-emerald-100 text-emerald-700 text-xs">Pago</Badge>
                    : <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">Pendente</Badge>
                  }
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(bill.value, currency)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
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
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

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
