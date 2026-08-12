'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
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

  function renderActions(expense: Expense) {
    return (
      <>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(expense)}>
          <Pencil size={13} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(expense.id))}>
          <Trash2 size={13} />
        </Button>
      </>
    )
  }

  const columns: ColumnDef<Expense>[] = [
    {
      header: 'Descrição',
      cell: (e) => <span className="font-medium">{e.description}</span>,
    },
    {
      header: 'Categoria',
      cell: (e) => <Badge variant="outline" className="text-xs">{getCategoryLabel(e.type)}</Badge>,
    },
    {
      header: 'Responsável',
      cell: (e) => <span className="text-sm text-muted-foreground">{e.responsible}</span>,
    },
    {
      header: 'Parcelas',
      cell: (e) => (
        <span className="text-sm text-muted-foreground">
          {(e.monthsLeft ?? 1) > 1 ? `${e.monthsLeft}x` : '—'}
        </span>
      ),
    },
    {
      header: 'Valor',
      headerClassName: 'text-right',
      className: 'text-right font-semibold',
      cell: (e) => formatCurrency(e.value, currency),
    },
    {
      header: '',
      headerClassName: 'w-20',
      cell: (e) => <div className="flex items-center gap-1 justify-end">{renderActions(e)}</div>,
    },
  ]

  return (
    <>
      <DataTable
        data={expenses}
        columns={columns}
        keyExtractor={(e) => String(e.id)}
        loading={loading}
        emptyMessage="Nenhuma despesa encontrada neste mês"
        renderCard={(e) => (
          <DataCard
            primary={<span className="font-medium text-sm">{e.description}</span>}
            value={<span className="font-semibold text-sm">{formatCurrency(e.value, currency)}</span>}
            meta={
              <>
                <Badge variant="outline" className="text-xs">{getCategoryLabel(e.type)}</Badge>
                {e.responsible && <span className="text-xs text-muted-foreground">{e.responsible}</span>}
                {(e.monthsLeft ?? 1) > 1 && <span className="text-xs text-muted-foreground">{e.monthsLeft}x</span>}
              </>
            }
            actions={renderActions(e)}
          />
        )}
      />

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
