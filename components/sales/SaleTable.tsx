'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import { useSaleTableColumns } from './columns/useSaleTableColumns'
import { SaleTableActions } from './columns/SaleTableActions'
import SaleModal from './forms/SaleModal'
import { useDeleteSale } from '@/hooks/mutations/sales/use-delete-sale'
import { SALE_ROOMS } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import type { Sale } from '@/types'
import { useCurrencySession } from '@/hooks/use-currency-session'

interface SaleTableProps {
  sales: Sale[]
  loading: boolean
}

function formatDate(date?: Date | string) {
  if (!date) return null
  return new Date(date).toLocaleDateString('pt-BR')
}

function getLabel<T extends string>(list: { value: T; label: string }[], value: T) {
  return list.find((i) => i.value === value)?.label ?? value
}

function statusBadgeClass(active: boolean) {
  return active ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300'
}

export default function SaleTable({ sales, loading }: SaleTableProps) {
  const { currency } = useCurrencySession()
  const deleteSale = useDeleteSale()

  const [editing, setEditing] = useState<Sale | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const columns = useSaleTableColumns({ currency, onEdit: setEditing, onDelete: setDeletingId })

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
                <Badge variant="outline" className={`text-xs ${statusBadgeClass(s.paid)}`}>
                  {s.paid ? 'Pago' : 'Pendente'}
                </Badge>
                <Badge variant="outline" className={`text-xs ${statusBadgeClass(s.delivered)}`}>
                  {s.delivered ? 'Entregue' : 'Pendente'}
                </Badge>
                {s.saleDate && <span className="text-xs text-muted-foreground">{formatDate(s.saleDate)}</span>}
              </>
            }
            actions={<SaleTableActions sale={s} onEdit={setEditing} onDelete={setDeletingId} />}
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
