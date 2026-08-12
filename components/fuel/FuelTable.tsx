'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import FuelModal from './FuelModal'
import { useDeleteFuel } from '@/hooks/mutations/fuel/use-delete-fuel'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import type { Fuel, Currency } from '@/types'

interface FuelTableProps {
  entries: Fuel[]
  loading: boolean
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export default function FuelTable({ entries, loading }: FuelTableProps) {
  const { data: session } = useSession()
  const currency = (session?.user?.currentCurrency ?? 'BRL') as Currency
  const deleteFuel = useDeleteFuel()

  const [editing, setEditing] = useState<Fuel | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteFuel.mutateAsync(deletingId)
      toast.success('Abastecimento excluído')
    } catch {
      toast.error('Erro ao excluir')
    } finally {
      setDeletingId(null)
    }
  }

  function renderActions(entry: Fuel) {
    return (
      <>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(entry)}>
          <Pencil size={13} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(entry.id))}>
          <Trash2 size={13} />
        </Button>
      </>
    )
  }

  const columns: ColumnDef<Fuel>[] = [
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
      cell: (e) => <div className="flex items-center gap-1 justify-end">{renderActions(e)}</div>,
    },
  ]

  return (
    <>
      <DataTable
        data={entries}
        columns={columns}
        keyExtractor={(e) => String(e.id)}
        loading={loading}
        emptyMessage="Nenhum abastecimento registrado"
        renderCard={(e) => (
          <DataCard
            primary={<span className="font-medium text-sm">{formatDate(e.creationDate)}</span>}
            value={<span className="font-semibold text-sm">{formatCurrency(Number(e.value), currency)}</span>}
            meta={
              <>
                <span className="text-xs text-muted-foreground">
                  Preço/L: R$ {Number(e.valuePerLiter).toFixed(3)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(Number(e.value) / Number(e.valuePerLiter)).toFixed(3)} L
                </span>
              </>
            }
            actions={renderActions(e)}
          />
        )}
      />

      <FuelModal open={!!editing} fuel={editing} onClose={() => setEditing(undefined)} />

      <ConfirmDialog
        open={!!deletingId}
        loading={deleteFuel.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  )
}
