'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateSale } from '@/hooks/mutations/sales/use-create-sale'
import { useUpdateSale } from '@/hooks/mutations/sales/use-update-sale'
import { saleSchema, type SaleFormData } from '@/lib/schemas/sale.schema'
import { SALE_ROOMS, PAYMENT_STATUSES, DELIVERY_STATUSES } from '@/constants'
import type { Sale } from '@/types'

interface SaleModalProps {
  open: boolean
  sale?: Sale
  onClose: () => void
}

function toDateInput(date?: Date | string) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export default function SaleModal({ open, sale, onClose }: SaleModalProps) {
  const createSale = useCreateSale()
  const updateSale = useUpdateSale()
  const isEditing = !!sale

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: { paymentStatus: 'PENDING', deliveryStatus: 'PENDING' },
  })

  useEffect(() => {
    if (sale) {
      reset({
        name:           sale.name,
        room:           sale.room,
        buyer:          sale.buyer ?? '',
        value:          sale.value,
        discount:       sale.discount ?? 0,
        installments:   sale.installments ?? 1,
        bookingDate:    toDateInput(sale.bookingDate),
        saleDate:       toDateInput(sale.saleDate),
        paymentStatus:  sale.paymentStatus,
        deliveryStatus: sale.deliveryStatus,
      })
    } else {
      reset({ paymentStatus: 'PENDING', deliveryStatus: 'PENDING' })
    }
  }, [sale, reset])

  async function onSubmit(data: SaleFormData) {
    try {
      if (isEditing) {
        await updateSale.mutateAsync({ id: String(sale._id), ...data })
        toast.success('Venda atualizada')
      } else {
        await createSale.mutateAsync(data)
        toast.success('Venda criada')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar venda')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar venda' : 'Nova venda'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2">
              <Label>Nome do item</Label>
              <Input {...register('name')} placeholder="Ex: Mesa de madeira" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Cômodo</Label>
              <Select
                defaultValue={sale?.room}
                onValueChange={(v) => setValue('room', v as SaleFormData['room'])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {SALE_ROOMS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.room && <p className="text-xs text-red-500">{errors.room.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Comprador <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input {...register('buyer')} placeholder="Nome do comprador" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" {...register('value', { valueAsNumber: true })} placeholder="0,00" />
              {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Desconto (R$) <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input type="number" step="0.01" {...register('discount', { valueAsNumber: true })} placeholder="0,00" />
            </div>

            <div className="space-y-1">
              <Label>Parcelas</Label>
              <Input type="number" min="1" {...register('installments', { valueAsNumber: true })} placeholder="1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Data da reserva <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input type="date" {...register('bookingDate')} />
            </div>

            <div className="space-y-1">
              <Label>Data da venda <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input type="date" {...register('saleDate')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Status de pagamento</Label>
              <Select
                defaultValue={sale?.paymentStatus ?? 'PENDING'}
                onValueChange={(v) => setValue('paymentStatus', v as SaleFormData['paymentStatus'])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Status de entrega</Label>
              <Select
                defaultValue={sale?.deliveryStatus ?? 'PENDING'}
                onValueChange={(v) => setValue('deliveryStatus', v as SaleFormData['deliveryStatus'])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DELIVERY_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
