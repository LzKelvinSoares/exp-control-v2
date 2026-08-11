'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateFuel } from '@/hooks/mutations/fuel/use-create-fuel'
import { useUpdateFuel } from '@/hooks/mutations/fuel/use-update-fuel'
import { fuelSchema, type FuelFormData } from '@/lib/schemas/fuel.schema'
import type { Fuel } from '@/types'

interface FuelModalProps {
  open: boolean
  fuel?: Fuel
  onClose: () => void
}

function toDateInput(date?: Date | string) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export default function FuelModal({ open, fuel, onClose }: FuelModalProps) {
  const createFuel = useCreateFuel()
  const updateFuel = useUpdateFuel()
  const isEditing = !!fuel

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<FuelFormData>({
    resolver: zodResolver(fuelSchema),
  })

  const totalCost = useWatch({ control, name: 'totalCost' })
  const pricePerLiter = useWatch({ control, name: 'pricePerLiter' })
  const liters = totalCost > 0 && pricePerLiter > 0
    ? (totalCost / pricePerLiter).toFixed(3)
    : '—'

  useEffect(() => {
    if (fuel) {
      reset({
        date:          toDateInput(fuel.date),
        totalCost:     fuel.totalCost,
        pricePerLiter: fuel.pricePerLiter,
      })
    } else {
      reset()
    }
  }, [fuel, reset])

  async function onSubmit(data: FuelFormData) {
    try {
      if (isEditing) {
        await updateFuel.mutateAsync({ id: String(fuel._id), ...data })
        toast.success('Abastecimento atualizado')
      } else {
        await createFuel.mutateAsync(data)
        toast.success('Abastecimento registrado')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar abastecimento')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar abastecimento' : 'Novo abastecimento'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Data</Label>
            <Input type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Custo total (R$)</Label>
              <Input type="number" step="0.01" {...register('totalCost', { valueAsNumber: true })} placeholder="0,00" />
              {errors.totalCost && <p className="text-xs text-red-500">{errors.totalCost.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Preço por litro (R$)</Label>
              <Input type="number" step="0.001" {...register('pricePerLiter', { valueAsNumber: true })} placeholder="0,000" />
              {errors.pricePerLiter && <p className="text-xs text-red-500">{errors.pricePerLiter.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600">
            <span>Litros calculados:</span>
            <span className="font-semibold text-slate-800">{liters} L</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
