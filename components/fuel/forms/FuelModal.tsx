'use client'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateFuel } from '@/hooks/mutations/fuel/use-create-fuel'
import { useUpdateFuel } from '@/hooks/mutations/fuel/use-update-fuel'
import { fuelSchema, type FuelFormData } from '@/lib/schemas/fuel.schema'
import { Fuel } from '@/types/app-types'
import { toDateInput } from '@/lib/utils'
import { FuelFormContent } from './FuelFormContent'

interface FuelModalProps {
  open: boolean
  fuel?: Fuel
  onClose: () => void
}

export default function FuelModal({ open, fuel, onClose }: FuelModalProps) {
  const createFuel = useCreateFuel()
  const updateFuel = useUpdateFuel()
  const isEditing = !!fuel

  const methods = useForm<FuelFormData>({
    resolver: zodResolver(fuelSchema),
  })
  const { handleSubmit, reset, formState: { isSubmitting } } = methods

  useEffect(() => {
    if (fuel) {
      reset({
        creationDate: toDateInput(fuel.creationDate),
        value: fuel.value,
        valuePerLiter: fuel.valuePerLiter,
      })
    } else {
      reset()
    }
  }, [fuel, reset])

  async function onSubmit(data: FuelFormData) {
    try {
      if (isEditing) {
        await updateFuel.mutateAsync({ id: String(fuel.id), ...data })
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
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar abastecimento' : 'Novo abastecimento'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FuelFormContent />
            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={onClose}>Cancelar</Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Registrar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
