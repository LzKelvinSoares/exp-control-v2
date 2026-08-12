'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
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

  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  )

  if (!entries.length) return (
    <p className="text-sm text-muted-foreground text-center py-10">
      Nenhum abastecimento registrado
    </p>
  )

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Preço/L (R$)</TableHead>
              <TableHead className="text-right">Litros</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={String(entry.id)}>
                <TableCell className="font-medium">{formatDate(entry.creationDate)}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {Number(entry.valuePerLiter).toFixed(3)}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {(Number(entry.value) / Number(entry.valuePerLiter)).toFixed(3)} L
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(Number(entry.value), currency)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(entry)}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(entry.id))}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => (
          <div key={String(entry.id)} className="rounded-lg border bg-white p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-sm">{formatDate(entry.creationDate)}</span>
              <span className="font-semibold text-sm shrink-0">{formatCurrency(Number(entry.value), currency)}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Preço/L: R$ {Number(entry.valuePerLiter).toFixed(3)}</span>
              <span>{(Number(entry.value) / Number(entry.valuePerLiter)).toFixed(3)} L</span>
            </div>

            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(entry)}>
                <Pencil size={13} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(entry.id))}>
                <Trash2 size={13} />
              </Button>
            </div>
          </div>
        ))}
      </div>

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
