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
import { useCreateBill } from '@/hooks/mutations/bills/use-create-bill'
import { useUpdateBill } from '@/hooks/mutations/bills/use-update-bill'
import { billSchema, type BillFormData } from '@/lib/schemas/bill.schema'
import { BILL_CATEGORIES } from '@/constants'
import type { Bill } from '@/types'

interface BillModalProps {
  open: boolean
  bill?: Bill
  onClose: () => void
}

function toDateInput(date?: Date | string) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export default function BillModal({ open, bill, onClose }: BillModalProps) {
  const createBill = useCreateBill()
  const updateBill = useUpdateBill()
  const isEditing = !!bill

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
  })

  useEffect(() => {
    if (bill) {
      reset({
        name:     bill.name,
        category: bill.category,
        value:    bill.value,
        dueDate:  toDateInput(bill.dueDate),
        barcode:  bill.barcode ?? '',
      })
    } else {
      reset({ barcode: '' })
    }
  }, [bill, reset])

  async function onSubmit(data: BillFormData) {
    try {
      if (isEditing) {
        await updateBill.mutateAsync({ id: String(bill._id), ...data })
        toast.success('Conta atualizada')
      } else {
        await createBill.mutateAsync(data)
        toast.success('Conta criada')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar conta')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar conta' : 'Nova conta'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input {...register('name')} placeholder="Ex: Energia elétrica" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select
                defaultValue={bill?.category}
                onValueChange={(v) => setValue('category', v as BillFormData['category'])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {BILL_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" {...register('value', { valueAsNumber: true })} placeholder="0,00" />
              {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Vencimento</Label>
            <Input type="date" {...register('dueDate')} />
            {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Código de barras <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Input {...register('barcode')} placeholder="000000000000000" />
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
