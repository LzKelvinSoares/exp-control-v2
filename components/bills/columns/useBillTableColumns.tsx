import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { BillTableActions } from './BillTableActions'
import { BILL_CATEGORIES } from '@/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Bill, ColumnDef, Currency } from '@/types/app-types'

interface UseBillTableColumnsParams {
  currency: Currency
  selected: Set<string>
  allSelected: boolean
  isPaying: boolean
  onToggleAll: () => void
  onToggleSelect: (id: string) => void
  onEdit: (bill: Bill) => void
  onDelete: (id: string) => void
  onPay: (id: string) => void
}

function isDueSoon(expirationDate: Date | string) {
  const due = new Date(expirationDate)
  const now = new Date()
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 5
}

export function useBillTableColumns({
  currency,
  selected,
  allSelected,
  isPaying,
  onToggleAll,
  onToggleSelect,
  onEdit,
  onDelete,
  onPay,
}: UseBillTableColumnsParams): ColumnDef<Bill>[] {
  function getCategoryLabel(value: string) {
    return BILL_CATEGORIES.find((c) => c.value === value)?.label ?? value
  }

  return [
    {
      header: <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />,
      headerClassName: 'w-10',
      cell: (b) => !b.paid
        ? <Checkbox checked={selected.has(String(b.id))} onCheckedChange={() => onToggleSelect(String(b.id))} />
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
      cell: (b) => (
        <div className="flex items-center gap-1 justify-end">
          <BillTableActions bill={b} onEdit={onEdit} onDelete={onDelete} onPay={onPay} isPaying={isPaying} />
        </div>
      ),
    },
  ]
}
