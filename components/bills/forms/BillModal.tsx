'use client'

import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateBill } from '@/hooks/mutations/bills/use-create-bill'
import { useUpdateBill } from '@/hooks/mutations/bills/use-update-bill'
import { billSchema, type BillFormData } from '@/lib/schemas/bill.schema'
import { BILL_CATEGORIES, CURRENCY_SYMBOLS } from '@/constants'
import { Bill, BillCategory, CategoryOption } from '@/types/app-types'
import { toDateInput } from '@/lib/utils'
import { SelectInput } from '@/components/ui/inputs/select-input'
import { NumberInput } from '@/components/ui/inputs/number-input'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { DateInput } from '@/components/ui/inputs/date-input'
import { TextInput } from '@/components/ui/inputs/text-input'
import { CheckboxInput } from '@/components/ui/inputs/checkbox-input'

interface BillModalProps {
  open: boolean
  bill?: Bill
  onClose: () => void
}

export default function BillModal({ open, bill, onClose }: BillModalProps) {
  const createBill = useCreateBill()
  const updateBill = useUpdateBill()
  const { currency } = useCurrencySession()
  const isEditing = !!bill?.id

  const methods = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: { barCode: '', saveAsExpense: false },
  })
  const { handleSubmit, reset, formState: { isSubmitting } } = methods

  useEffect(() => {
    if (bill) {
      reset({
        description: bill.description,
        type: bill.type,
        value: bill.value,
        expirationDate: toDateInput(bill.expirationDate),
        barCode: bill.barCode ?? '',
        saveAsExpense: false,
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
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar conta' : 'Nova conta'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

            <TextInput
              name={'description'}
              title={'Nome'}
              placeholder='Ex: Energia elétrica'
            />

            <div className='grid grid-cols-2 gap-3'>
              <SelectInput<CategoryOption<BillCategory>>
                name='type'
                title='Categoria'
                options={BILL_CATEGORIES}
                defaultValue={bill?.type ?? ''}
              />

              <NumberInput
                name='value'
                title={`Valor (${CURRENCY_SYMBOLS[currency || 'BRL']})`}
                min={0.01}
                step={0.01}
              />
            </div>

            <DateInput
              name='expirationDate'
              title='Vencimento'
            />

            <TextInput
              name={'barCode'}
              title={<>Código de barras <span className='text-muted-foreground text-xs'>(opcional)</span></>}
              placeholder='000000000000000'
            />

            {!isEditing && (
              <div className='flex items-center gap-2'>
                <CheckboxInput
                  name='saveAsExpense'
                  label='Salvar também como despesa'
                />
              </div>
            )}

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
