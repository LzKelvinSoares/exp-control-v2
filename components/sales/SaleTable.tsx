'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { DataCard } from '@/components/shared/DataCard'
import { useSaleTableColumns } from './columns/useSaleTableColumns'
import { SaleTableActions } from './columns/SaleTableActions'
import SaleModal from './forms/SaleModal'
import { useDeleteSale } from '@/hooks/mutations/sales/use-delete-sale'
import { SALE_ROOMS } from '@/constants'
import { formatCurrency, getGoogleDriveImageUrl } from '@/lib/utils'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { Sale } from '@/types/app-types'

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
  const [cloning, setCloning] = useState<Sale | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewSale, setPreviewSale] = useState<Sale | null>(null)

  function handleClone(sale: Sale) {
    setCloning({ ...sale, id: undefined })
  }

  const columns = useSaleTableColumns({ currency, onEdit: setEditing, onClone: handleClone, onDelete: setDeletingId, onPreview: setPreviewSale })
  const previewImage = previewSale ? getGoogleDriveImageUrl(previewSale.imgId) : null

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
        renderCard={(s) => {
          const saleImage = getGoogleDriveImageUrl(s.imgId)

          return (
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
                  {saleImage && (
                    <div className="w-full">
                      <Image
                        src={saleImage}
                        alt={`Imagem da venda ${s.description}`}
                        width={720}
                        height={420}
                        className="h-36 w-full rounded-md border object-cover"
                        unoptimized
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
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
              actions={<SaleTableActions sale={s} onEdit={setEditing} onClone={handleClone} onDelete={setDeletingId} onPreview={setPreviewSale} />}
            />
          )
        }}
      />

      <Dialog open={!!previewSale} onOpenChange={(open) => !open && setPreviewSale(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="relative aspect-[4/3] w-full bg-muted">
            {previewImage ? (
              <Image
                src={previewImage}
                alt={`Imagem da venda ${previewSale?.description ?? 'venda'}`}
                fill
                className="object-contain"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Imagem indisponível</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SaleModal open={!!editing} sale={editing} onClose={() => setEditing(undefined)} key={editing?.id} />
      <SaleModal open={!!cloning} sale={cloning} onClose={() => setCloning(undefined)} key={cloning?.description} />

      <ConfirmDialog
        open={!!deletingId}
        loading={deleteSale.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  )
}
