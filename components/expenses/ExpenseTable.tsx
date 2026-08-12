'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import { useExpenseTableColumns } from './columns/useExpenseTableColumns'
import { ExpenseTableActions } from './columns/ExpenseTableActions'
import ExpenseModal from './forms/ExpenseModal'
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

  const columns = useExpenseTableColumns({ currency, onEdit: setEditing, onDelete: setDeletingId })

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
            actions={<ExpenseTableActions expense={e} onEdit={setEditing} onDelete={setDeletingId} />}
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
