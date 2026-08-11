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
import { useCreateRevenue } from '@/hooks/mutations/revenues/use-create-revenue'
import { useUpdateRevenue } from '@/hooks/mutations/revenues/use-update-revenue'
import { revenueSchema, type RevenueFormData } from '@/lib/schemas/revenue.schema'
import { REVENUE_CATEGORIES } from '@/constants'
import { useCalendar } from '@/store/calendar'
import type { Revenue } from '@/types'

interface RevenueModalProps {
  open: boolean
  revenue?: Revenue
  onClose: () => void
}

export default function RevenueModal({ open, revenue, onClose }: RevenueModalProps) {
  const { month, year } = useCalendar()
  const createRevenue = useCreateRevenue()
  const updateRevenue = useUpdateRevenue()
  const isEditing = !!revenue

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<RevenueFormData>({
    resolver: zodResolver(revenueSchema),
    defaultValues: { installments: 1 },
  })

  useEffect(() => {
    if (revenue) {
      reset({
        description:  revenue.description,
        category:     revenue.category,
        responsible:  revenue.responsible,
        value:        revenue.value,
        installments: revenue.installments ?? 1,
      })
    } else {
      reset({ installments: 1 })
    }
  }, [revenue, reset])

  async function onSubmit(data: RevenueFormData) {
    try {
      if (isEditing) {
        await updateRevenue.mutateAsync({ id: String(revenue._id), ...data })
        toast.success('Receita atualizada')
      } else {
        await createRevenue.mutateAsync({ ...data, month, year })
        toast.success('Receita criada')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar receita')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar receita' : 'Nova receita'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Input {...register('description')} placeholder="Ex: Salário" />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select
                defaultValue={revenue?.category}
                onValueChange={(v) => setValue('category', v as RevenueFormData['category'])}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {REVENUE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Responsável</Label>
              <Input {...register('responsible')} placeholder="Ex: Kelvin" />
              {errors.responsible && <p className="text-xs text-red-500">{errors.responsible.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" {...register('value', { valueAsNumber: true })} placeholder="0,00" />
              {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Parcelas</Label>
              <Input type="number" min="1" {...register('installments', { valueAsNumber: true })} placeholder="1" />
              {errors.installments && <p className="text-xs text-red-500">{errors.installments.message}</p>}
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
