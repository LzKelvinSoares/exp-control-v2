'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ExpenseModal from './ExpenseModal'
import { useDeleteExpense } from '@/hooks/mutations/expenses/use-delete-expense'
import { EXPENSE_CATEGORIES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Expense, Currency } from '@/types'

interface ExpenseTableProps {
  expenses: Expense[]
  loading: boolean
}

export default function ExpenseTable({ expenses, loading }: ExpenseTableProps) {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const deleteExpense = useDeleteExpense()

  const [editing, setEditing] = useState<Expense | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteExpense.mutateAsync(deletingId)
      toast.success('Despesa excluída')
    } catch {
      toast.error('Erro ao excluir')
    } finally {
      setDeletingId(null)
    }
  }

  function getCategoryLabel(value: string) {
    return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value
  }

  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  )

  if (!expenses.length) return (
    <p className="text-sm text-muted-foreground text-center py-10">
      Nenhuma despesa encontrada neste mês
    </p>
  )

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Parcelas</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={String(expense.id)}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{getCategoryLabel(expense.type)}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{expense.responsible}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {(expense.monthsLeft ?? 1) > 1 ? `${expense.monthsLeft}x` : '—'}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(expense.value, currency)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(expense)}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(expense.id))}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => (
          <div key={String(expense.id)} className="rounded-lg border bg-white p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-sm truncate">{expense.description}</span>
              <span className="font-semibold text-sm shrink-0">{formatCurrency(expense.value, currency)}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{getCategoryLabel(expense.type)}</Badge>
              {expense.responsible && (
                <span className="text-xs text-muted-foreground">{expense.responsible}</span>
              )}
              {(expense.monthsLeft ?? 1) > 1 && (
                <span className="text-xs text-muted-foreground">{expense.monthsLeft}x</span>
              )}
            </div>

            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(expense)}>
                <Pencil size={13} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(expense.id))}>
                <Trash2 size={13} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ExpenseModal open={!!editing} expense={editing} onClose={() => setEditing(undefined)} />

      <ConfirmDialog
        open={!!deletingId}
        loading={deleteExpense.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  )
}
