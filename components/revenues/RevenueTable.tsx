'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
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

  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  )

  if (!revenues.length) return (
    <p className="text-sm text-muted-foreground text-center py-10">
      Nenhuma receita encontrada neste mês
    </p>
  )

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Parcelas</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {revenues.map((revenue) => (
            <TableRow key={String(revenue.id)}>
              <TableCell className="font-medium">{revenue.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">{getCategoryLabel(revenue.type)}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{revenue.responsible}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {(revenue.monthsLeft ?? 1) > 1 ? `${revenue.monthsLeft}x` : '—'}
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(revenue.value, currency)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 justify-end">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(revenue)}>
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(revenue.id))}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
