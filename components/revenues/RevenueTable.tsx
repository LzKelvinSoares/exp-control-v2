'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import RevenueModal from './RevenueModal'
import { useDeleteRevenue } from '@/hooks/mutations/revenues/use-delete-revenue'
import { REVENUE_CATEGORIES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Revenue, Currency } from '@/types'

interface RevenueTableProps {
  revenues: Revenue[]
  loading: boolean
}

export default function RevenueTable({ revenues, loading }: RevenueTableProps) {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const deleteRevenue = useDeleteRevenue()

  const [editing, setEditing] = useState<Revenue | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  function renderActions(revenue: Revenue) {
    return (
      <>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(revenue)}>
          <Pencil size={13} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(revenue.id))}>
          <Trash2 size={13} />
        </Button>
      </>
    )
  }

  const columns: ColumnDef<Revenue>[] = [
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
      cell: (r) => <div className="flex items-center gap-1 justify-end">{renderActions(r)}</div>,
    },
  ]

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
            actions={renderActions(r)}
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
