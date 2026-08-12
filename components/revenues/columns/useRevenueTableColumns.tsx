import { Badge } from '@/components/ui/badge'
import { type ColumnDef } from '@/components/shared/DataTable'
import { RevenueTableActions } from './RevenueTableActions'
import { REVENUE_CATEGORIES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import type { Revenue, Currency } from '@/types'

interface Params {
  currency: Currency
  onEdit: (revenue: Revenue) => void
  onDelete: (id: string) => void
}

export function useRevenueTableColumns({ currency, onEdit, onDelete }: Params): ColumnDef<Revenue>[] {
  function getCategoryLabel(value: string) {
    return REVENUE_CATEGORIES.find((c) => c.value === value)?.label ?? value
  }

  return [
    {
      header: 'Descrição',
      cell: (r) => <span className="font-medium">{r.description}</span>,
    },
    {
      header: 'Categoria',
      cell: (r) => <Badge variant="outline" className="text-xs">{getCategoryLabel(r.type)}</Badge>,
    },
    {
      header: 'Responsável',
      cell: (r) => <span className="text-sm text-muted-foreground">{r.responsible}</span>,
    },
    {
      header: 'Parcelas',
      cell: (r) => (
        <span className="text-sm text-muted-foreground">
          {(r.monthsLeft ?? 1) > 1 ? `${r.monthsLeft}x` : '—'}
        </span>
      ),
    },
    {
      header: 'Valor',
      headerClassName: 'text-right',
      className: 'text-right font-semibold',
      cell: (r) => formatCurrency(r.value, currency),
    },
    {
      header: '',
      headerClassName: 'w-20',
      cell: (r) => (
        <div className="flex items-center gap-1 justify-end">
          <RevenueTableActions revenue={r} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ]
}
