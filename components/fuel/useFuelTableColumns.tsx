import { type ColumnDef } from '@/components/shared/DataTable'
import { FuelTableActions } from './FuelTableActions'
import { formatCurrency } from '@/lib/utils'
import type { Fuel, Currency } from '@/types'

interface Params {
  currency: Currency
  onEdit: (entry: Fuel) => void
  onDelete: (id: string) => void
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function useFuelTableColumns({ currency, onEdit, onDelete }: Params): ColumnDef<Fuel>[] {
  return [
    {
      header: 'Data',
      cell: (e) => <span className="font-medium">{formatDate(e.creationDate)}</span>,
    },
    {
      header: 'Preço/L (R$)',
      headerClassName: 'text-right',
      className: 'text-right text-sm text-muted-foreground',
      cell: (e) => Number(e.valuePerLiter).toFixed(3),
    },
    {
      header: 'Litros',
      headerClassName: 'text-right',
      className: 'text-right text-sm text-muted-foreground',
      cell: (e) => `${(Number(e.value) / Number(e.valuePerLiter)).toFixed(3)} L`,
    },
    {
      header: 'Total',
      headerClassName: 'text-right',
      className: 'text-right font-semibold',
      cell: (e) => formatCurrency(Number(e.value), currency),
    },
    {
      header: '',
      headerClassName: 'w-20',
      cell: (e) => (
        <div className="flex items-center gap-1 justify-end">
          <FuelTableActions entry={e} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ]
}
