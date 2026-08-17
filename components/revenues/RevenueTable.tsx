'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import { useRevenueTableColumns } from './columns/useRevenueTableColumns'
import { RevenueTableActions } from './columns/RevenueTableActions'
import RevenueModal from './forms/RevenueModal'
import { useDeleteRevenue } from '@/hooks/mutations/revenues/use-delete-revenue'
import { REVENUE_CATEGORIES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { Budget } from '@/types/app-types'

interface RevenueTableProps {
  revenues: Budget[]
  loading: boolean
}

export default function RevenueTable({ revenues, loading }: RevenueTableProps) {
  const { currency } = useCurrencySession()
  const deleteRevenue = useDeleteRevenue()

  const [editing, setEditing] = useState<Budget | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const columns = useRevenueTableColumns({ currency, onEdit: setEditing, onDelete: setDeletingId })

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteRevenue.mutateAsync(deletingId)
      toast.success('Receita excluída')
    } catch {
      toast.error('Erro ao excluir')
    } finally {
      setDeletingId(null)
    }
  }

  function getCategoryLabel(value: string) {
    return REVENUE_CATEGORIES.find((c) => c.value === value)?.label ?? value
  }

  return (
    <>
      <DataTable
        data={revenues}
        columns={columns}
        keyExtractor={(r) => String(r.id)}
        loading={loading}
        emptyMessage="Nenhuma receita encontrada neste mês"
        renderCard={(r) => (
          <DataCard
            primary={<span className="font-medium text-sm">{r.description}</span>}
            value={<span className="font-semibold text-sm">{formatCurrency(r.value, currency)}</span>}
            meta={
              <>
                <Badge variant="outline" className="text-xs">{getCategoryLabel(r.type)}</Badge>
                {r.responsible && <span className="text-xs text-muted-foreground">{r.responsible}</span>}
                {(r.monthsLeft ?? 1) > 1 && <span className="text-xs text-muted-foreground">{r.monthsLeft}x</span>}
              </>
            }
            actions={<RevenueTableActions revenue={r} onEdit={setEditing} onDelete={setDeletingId} />}
          />
        )}
      />

      <RevenueModal open={!!editing} revenue={editing} onClose={() => setEditing(undefined)} />

      <ConfirmDialog
        open={!!deletingId}
        loading={deleteRevenue.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  )
}
