import { Badge } from '@/components/ui/badge'
import { type ColumnDef } from '@/components/shared/DataTable'
import { SaleTableActions } from './SaleTableActions'
import { SALE_ROOMS } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import type { Sale, Currency } from '@/types'

interface Params {
  currency: Currency
  onEdit: (sale: Sale) => void
  onDelete: (id: string) => void
}

function formatDate(date?: Date | string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-BR')
}

function getLabel<T extends string>(list: { value: T; label: string }[], value: T) {
  return list.find((i) => i.value === value)?.label ?? value
}

function statusBadgeClass(active: boolean) {
  return active ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300'
}

export function useSaleTableColumns({ currency, onEdit, onDelete }: Params): ColumnDef<Sale>[] {
  return [
    {
      header: 'Item',
      cell: (s) => <span className="font-medium">{s.description}</span>,
    },
    {
      header: 'Cômodo',
      cell: (s) => <Badge variant="outline" className="text-xs">{getLabel(SALE_ROOMS, s.room)}</Badge>,
    },
    {
      header: 'Comprador',
      cell: (s) => <span className="text-sm text-muted-foreground">{s.buyer || '—'}</span>,
    },
    {
      header: 'Venda',
      cell: (s) => <span className="text-sm text-muted-foreground">{formatDate(s.saleDate)}</span>,
    },
    {
      header: 'Pagamento',
      cell: (s) => (
        <Badge variant="outline" className={`text-xs ${statusBadgeClass(s.paid)}`}>
          {s.paid ? 'Pago' : 'Pendente'}
        </Badge>
      ),
    },
    {
      header: 'Entrega',
      cell: (s) => (
        <Badge variant="outline" className={`text-xs ${statusBadgeClass(s.delivered)}`}>
          {s.delivered ? 'Entregue' : 'Pendente'}
        </Badge>
      ),
    },
    {
      header: 'Valor',
      headerClassName: 'text-right',
      className: 'text-right font-semibold',
      cell: (s) => formatCurrency(s.value, currency),
    },
    {
      header: '',
      headerClassName: 'w-20',
      cell: (s) => (
        <div className="flex items-center gap-1 justify-end">
          <SaleTableActions sale={s} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ]
}
