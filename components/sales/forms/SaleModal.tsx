'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateSale } from '@/hooks/mutations/sales/use-create-sale'
import { useUpdateSale } from '@/hooks/mutations/sales/use-update-sale'
import { saleSchema, type SaleFormData } from '@/lib/schemas/sale.schema'
import { SALE_ROOMS } from '@/constants'
import { Sale } from '@/types/app-types'

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

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: { paid: false, delivered: false },
  })

  const paid = watch('paid')
  const delivered = watch('delivered')
  const room = watch('room')

  useEffect(() => {
    if (sale) {
      reset({
        description:  sale.description,
        room:         sale.room,
        buyer:        sale.buyer ?? '',
        value:        sale.value,
        valuePaid:    sale.valuePaid ? String(sale.valuePaid) : '',
        discount:     sale.discount ?? '',
        installments: sale.installments ?? 1,
        bookingDate:  toDateInput(sale.bookingDate),
        saleDate:     toDateInput(sale.saleDate),
        paid:         sale.paid,
        delivered:    sale.delivered,
      })
    } else {
      reset({ paid: false, delivered: false })
    }
  }, [sale, reset])

  async function onSubmit(data: SaleFormData) {
    try {
      if (isEditing) {
        await updateSale.mutateAsync({ id: String(sale.id), ...data })
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
              <Label>Descrição</Label>
              <Input {...register('description')} placeholder="Ex: Mesa de madeira" />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Cômodo</Label>
              <Select
                value={room ?? ''}
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
              <Label>Valor pago <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input {...register('valuePaid')} placeholder="0,00" />
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

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="paid"
                checked={paid}
                onCheckedChange={(v) => setValue('paid', !!v)}
              />
              <Label htmlFor="paid">Pago</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="delivered"
                checked={delivered}
                onCheckedChange={(v) => setValue('delivered', !!v)}
              />
              <Label htmlFor="delivered">Entregue</Label>
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
