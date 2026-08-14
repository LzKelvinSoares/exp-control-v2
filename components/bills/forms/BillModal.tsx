'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
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

  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: { barCode: '', saveAsExpense: false },
  })
  const saveAsExpense = useWatch({ control, name: 'saveAsExpense', defaultValue: false })
  const typeValue = useWatch({ control, name: 'type', defaultValue: '' })

  useEffect(() => {
    if (bill) {
      reset({
        description:    bill.description,
        type:           bill.type,
        value:          bill.value,
        expirationDate: toDateInput(bill.expirationDate),
        barCode:        bill.barCode ?? '',
        saveAsExpense:  false,
      })
    } else {
      reset({ barCode: '', saveAsExpense: false })
    }
  }, [bill, reset])

  async function onSubmit(data: BillFormData) {
    try {
      if (isEditing) {
        await updateBill.mutateAsync({ id: String(bill.id), ...data })
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
            <Input {...register('description')} placeholder="Ex: Energia elétrica" />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select
                value={typeValue ?? ''}
                onValueChange={(v) => setValue('type', v ?? '')}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {BILL_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" {...register('value', { valueAsNumber: true })} placeholder="0,00" />
              {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Vencimento</Label>
            <Input type="date" {...register('expirationDate')} />
            {errors.expirationDate && <p className="text-xs text-red-500">{errors.expirationDate.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Código de barras <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Input {...register('barCode')} placeholder="000000000000000" />
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={saveAsExpense}
                onCheckedChange={(checked) => setValue('saveAsExpense', Boolean(checked))}
              />
              <Label className="cursor-pointer font-normal" onClick={() => setValue('saveAsExpense', !saveAsExpense)}>
                Salvar também como despesa
              </Label>
            </div>
          )}

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
