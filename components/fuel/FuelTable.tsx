'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import { useFuelTableColumns } from './columns/useFuelTableColumns'
import { FuelTableActions } from './columns/FuelTableActions'
import FuelModal from './forms/FuelModal'
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

  const columns = useFuelTableColumns({ currency, onEdit: setEditing, onDelete: setDeletingId })

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
            actions={<FuelTableActions entry={e} onEdit={setEditing} onDelete={setDeletingId} />}
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
