'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import SaleModal from './SaleModal'
import { useDeleteSale } from '@/hooks/mutations/sales/use-delete-sale'
import { SALE_ROOMS } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Sale, Currency } from '@/types'

interface SaleTableProps {
  sales: Sale[]
  loading: boolean
}

function formatDate(date?: Date | string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-BR')
}

function getLabel<T extends string>(list: { value: T; label: string }[], value: T) {
  return list.find((i) => i.value === value)?.label ?? value
}

function paidBadgeClass(paid: boolean) {
  return paid ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300'
}

export default function SaleTable({ sales, loading }: SaleTableProps) {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const deleteSale = useDeleteSale()

  const [editing, setEditing] = useState<Sale | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteSale.mutateAsync(deletingId)
      toast.success('Venda excluída')
    } catch {
      toast.error('Erro ao excluir')
    } finally {
      setDeletingId(null)
    }
  }

  function renderActions(sale: Sale) {
    return (
      <>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(sale)}>
          <Pencil size={13} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(sale.id))}>
          <Trash2 size={13} />
        </Button>
      </>
    )
  }

  const columns: ColumnDef<Sale>[] = [
    {
      header: 'Item',
      cell: (s) => <span className="font-medium">{s.description}</span>,
    },
    {
      header: 'Cômodo',
      cell: (s) => (
        <Badge variant="outline" className="text-xs">{getLabel(SALE_ROOMS, s.room)}</Badge>
      ),
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
        <Badge variant="outline" className={`text-xs ${paidBadgeClass(s.paid)}`}>
          {s.paid ? 'Pago' : 'Pendente'}
        </Badge>
      ),
    },
    {
      header: 'Entrega',
      cell: (s) => (
        <Badge variant="outline" className={`text-xs ${paidBadgeClass(s.delivered)}`}>
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
      cell: (s) => <div className="flex items-center gap-1 justify-end">{renderActions(s)}</div>,
    },
  ]

  return (
    <>
      <DataTable
        data={sales}
        columns={columns}
        keyExtractor={(s) => String(s.id)}
        loading={loading}
        emptyMessage="Nenhuma venda cadastrada"
        renderCard={(s) => (
          <DataCard
            primary={
              <div>
                <p className="font-medium text-sm">{s.description}</p>
                {s.buyer && <p className="text-xs text-muted-foreground">{s.buyer}</p>}
              </div>
            }
            value={<span className="font-semibold text-sm">{formatCurrency(s.value, currency)}</span>}
            meta={
              <>
                <Badge variant="outline" className="text-xs">{getLabel(SALE_ROOMS, s.room)}</Badge>
                <Badge variant="outline" className={`text-xs ${paidBadgeClass(s.paid)}`}>
                  {s.paid ? 'Pago' : 'Pendente'}
                </Badge>
                <Badge variant="outline" className={`text-xs ${paidBadgeClass(s.delivered)}`}>
                  {s.delivered ? 'Entregue' : 'Pendente'}
                </Badge>
                {s.saleDate && <span className="text-xs text-muted-foreground">{formatDate(s.saleDate)}</span>}
              </>
            }
            actions={renderActions(s)}
          />
        )}
      />

      <SaleModal open={!!editing} sale={editing} onClose={() => setEditing(undefined)} />

      <ConfirmDialog
        open={!!deletingId}
        loading={deleteSale.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  )
}
