import { Badge } from '@/components/ui/badge'
import { type ColumnDef } from '@/components/shared/DataTable'
import { ExpenseTableActions } from './ExpenseTableActions'
import { EXPENSE_CATEGORIES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import type { Expense, Currency } from '@/types'

interface Params {
  currency: Currency
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function useExpenseTableColumns({ currency, onEdit, onDelete }: Params): ColumnDef<Expense>[] {
  function getCategoryLabel(value: string) {
    return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value
  }

  return [
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
      cell: (e) => (
        <div className="flex items-center gap-1 justify-end">
          <ExpenseTableActions expense={e} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ]
}
