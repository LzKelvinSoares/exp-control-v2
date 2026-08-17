import { type FilterDef } from '@/hooks/useTableFilter'
import { EXPENSE_CATEGORIES, REVENUE_CATEGORIES, BILL_CATEGORIES } from './categories'
import { SALE_ROOMS } from './sales'
import { Bill, Budget, Expense, Fuel, Sale } from '@/types/app-types'

export const EXPENSE_FILTER_DEFS: FilterDef<Expense>[] = [
  { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Buscar por Descrição' },
  { key: 'type', label: 'Categoria', type: 'select', options: EXPENSE_CATEGORIES },
  { key: 'responsible', label: 'Responsável', type: 'text', placeholder: 'Buscar por Responsável' },
]

export const REVENUE_FILTER_DEFS: FilterDef<Budget>[] = [
  { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Buscar por Descrição' },
  { key: 'type', label: 'Categoria', type: 'select', options: REVENUE_CATEGORIES },
  { key: 'responsible', label: 'Responsável', type: 'text', placeholder: 'Buscar por Responsável' },
]

export const FUEL_FILTER_DEFS: FilterDef<Fuel>[] = [
  {
    key: 'creationDate',
    label: 'Data',
    type: 'date',
    accessor: (e) => new Date(e.creationDate).toLocaleDateString('en-CA'),
  },
]

export const SALE_FILTER_DEFS: FilterDef<Sale>[] = [
  { key: 'description', label: 'Item', type: 'text', placeholder: 'Buscar por Item' },
  { key: 'room', label: 'Cômodo', type: 'select', options: SALE_ROOMS },
  { key: 'buyer', label: 'Comprador', type: 'text', placeholder: 'Buscar por Comprador' },
  { key: 'paid', label: 'Pagamento', type: 'select', options: [{ value: 'false', label: 'Pendente' }, { value: 'true', label: 'Pago' }], accessor: (s) => String(s.paid) },
  { key: 'delivered', label: 'Entrega', type: 'select', options: [{ value: 'false', label: 'Pendente' }, { value: 'true', label: 'Entregue' }], accessor: (s) => String(s.delivered) },
]

export const BILL_FILTER_DEFS: FilterDef<Bill>[] = [
  { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Buscar por Descrição' },
  { key: 'type', label: 'Categoria', type: 'select', options: BILL_CATEGORIES },
  { key: 'paid', label: 'Status', type: 'select', options: [{ value: 'false', label: 'Pendente' }, { value: 'true', label: 'Pago' }], accessor: (b) => String(b.paid) },
]
