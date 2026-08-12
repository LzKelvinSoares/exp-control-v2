'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
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

  if (loading) return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  )

  if (!sales.length) return (
    <p className="text-sm text-muted-foreground text-center py-10">
      Nenhuma venda cadastrada
    </p>
  )

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Cômodo</TableHead>
              <TableHead>Comprador</TableHead>
              <TableHead>Venda</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={String(sale.id)}>
                <TableCell className="font-medium">{sale.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getLabel(SALE_ROOMS, sale.room)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {sale.buyer || '—'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(sale.saleDate)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${sale.paid ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300'}`}>
                    {sale.paid ? 'Pago' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${sale.delivered ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300'}`}>
                    {sale.delivered ? 'Entregue' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(sale.value, currency)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(sale)}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(sale.id))}>
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
        {sales.map((sale) => (
          <div key={String(sale.id)} className="rounded-lg border bg-white p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{sale.description}</p>
                {sale.buyer && (
                  <p className="text-xs text-muted-foreground">{sale.buyer}</p>
                )}
              </div>
              <span className="font-semibold text-sm shrink-0">{formatCurrency(sale.value, currency)}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{getLabel(SALE_ROOMS, sale.room)}</Badge>
              <Badge variant="outline" className={`text-xs ${sale.paid ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300'}`}>
                {sale.paid ? 'Pago' : 'Pendente'}
              </Badge>
              <Badge variant="outline" className={`text-xs ${sale.delivered ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300'}`}>
                {sale.delivered ? 'Entregue' : 'Pendente'}
              </Badge>
              {sale.saleDate && (
                <span className="text-xs text-muted-foreground">{formatDate(sale.saleDate)}</span>
              )}
            </div>

            <div className="flex items-center gap-1 justify-end">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(sale)}>
                <Pencil size={13} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeletingId(String(sale.id))}>
                <Trash2 size={13} />
              </Button>
            </div>
          </div>
        ))}
      </div>

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
