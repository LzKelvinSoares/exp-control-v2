'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateRevenue } from '@/hooks/mutations/revenues/use-create-revenue'
import { useUpdateRevenue } from '@/hooks/mutations/revenues/use-update-revenue'
import { revenueSchema, type RevenueFormData } from '@/lib/schemas/revenue.schema'
import { toDateInput, fromDateInput } from '@/lib/utils'
import { CURRENCY_SYMBOLS, REVENUE_CATEGORIES } from '@/constants'
import { Budget, CategoryOption, RevenueCategory } from '@/types/app-types'
import { SelectInput } from '@/components/ui/inputs/select-input'
import { NumberInput } from '@/components/ui/inputs/number-input'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { DateInput } from '@/components/ui/inputs/date-input'
import { TextInput } from '@/components/ui/inputs/text-input'

interface RevenueModalProps {
  open: boolean
  revenue?: Budget
  onClose: () => void
}

export default function RevenueModal({ open, revenue, onClose }: RevenueModalProps) {
  const { currency } = useCurrencySession()
  const createRevenue = useCreateRevenue()
  const updateRevenue = useUpdateRevenue()
  const isEditing = !!revenue?.id

  const defaultValues: RevenueFormData = revenue
    ? {
        description: revenue.description,
        type: revenue.type,
        responsible: revenue.responsible,
        value: revenue.value,
        monthsLeft: revenue.monthsLeft ?? 1,
        firstExpirationDate: toDateInput(revenue.firstExpirationDate),
      }
    : {
        description: '',
        type: '',
        responsible: '',
        value: 0,
        monthsLeft: 1,
        firstExpirationDate: toDateInput(new Date()),
      }

  const methods = useForm<RevenueFormData>({
    resolver: zodResolver(revenueSchema),
    defaultValues,
  })

  const { handleSubmit, formState: { isSubmitting } } = methods

  async function onSubmit(data: RevenueFormData) {
    try {
      const firstExpirationDate = fromDateInput(data.firstExpirationDate)
      if (isEditing) {
        await updateRevenue.mutateAsync({ id: String(revenue.id), ...data, firstExpirationDate })
        toast.success('Receita atualizada')
      } else {
        await createRevenue.mutateAsync({ ...data, firstExpirationDate })
        toast.success('Receita criada')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar receita')
    }
  }

  return (
    <Dialog key={revenue?.id} open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar receita' : 'Nova receita'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <TextInput
              name='description'
              title='Descrição'
              placeholder='Ex: Salário'
            />

            <div className='grid grid-cols-2 gap-3'>
              <SelectInput<CategoryOption<RevenueCategory>>
                title='Categoria'
                name='type'
                options={REVENUE_CATEGORIES}
                defaultValue={revenue?.type ?? ''}
              />

              <TextInput
                name='responsible'
                title='Responsável'
                placeholder='Ex: Kelvin'
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <NumberInput
                name='value'
                title={`Valor (${CURRENCY_SYMBOLS[currency || 'BRL']})`}
                min={0.01}
                step={0.01}
              />

              <NumberInput
                name='monthsLeft'
                title='Parcelas'
                min={1}
              />
            </div>

            <DateInput
              name='firstExpirationDate'
              title='Primeiro vencimento'
            />

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={onClose}>Cancelar</Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
