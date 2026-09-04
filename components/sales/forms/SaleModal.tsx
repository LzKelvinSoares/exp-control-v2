'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateSale } from '@/hooks/mutations/sales/use-create-sale'
import { useUpdateSale } from '@/hooks/mutations/sales/use-update-sale'
import { saleSchema, type SaleFormData } from '@/lib/schemas/sale.schema'
import { SALE_ROOMS } from '@/constants'
import { CategoryOption, Sale, SaleRoom } from '@/types/app-types'
import { toDateInput } from '@/lib/utils'
import { SelectInput } from '@/components/ui/inputs/select-input'
import { NumberInput } from '@/components/ui/inputs/number-input'
import { DateInput } from '@/components/ui/inputs/date-input'
import { TextInput } from '@/components/ui/inputs/text-input'
import { CheckboxInput } from '@/components/ui/inputs/checkbox-input'

interface SaleModalProps {
  open: boolean
  sale?: Sale
  onClose: () => void
}

export default function SaleModal({ open, sale, onClose }: SaleModalProps) {
  const createSale = useCreateSale()
  const updateSale = useUpdateSale()
  const isEditing = !!sale

  const defaultSale = sale
    ? {
      description: sale.description,
      room: sale.room,
      buyer: sale.buyer ?? '',
      value: sale.value,
      valuePaid: sale.valuePaid ? String(sale.valuePaid) : '',
      discount: sale.discount ?? '',
      installments: sale.installments ?? 1,
      bookingDate: toDateInput(sale.bookingDate),
      saleDate: toDateInput(sale.saleDate),
      paid: sale.paid,
      delivered: sale.delivered,
    } : 
    {
      installments: 1,
      bookingDate: toDateInput(new Date()),
      saleDate: toDateInput(new Date()),
      paid: false,
      delivered: false,
    } as SaleFormData

  const methods = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: defaultSale,
  })

  const { handleSubmit, formState: { isSubmitting } } = methods

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
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar venda' : 'Nova venda'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1 col-span-2'>
                <TextInput
                  name={'description'}
                  title={'Descrição'}
                  placeholder='Ex: Mesa de madeira'
                />
              </div>

              <SelectInput<CategoryOption<SaleRoom>>
                name='room'
                title='Cômodo'
                options={SALE_ROOMS}
                defaultValue={sale?.room ?? ''}
              />

              <TextInput
                name={'buyer'}
                title={<>Comprador <span className='text-muted-foreground text-xs'>(opcional)</span></>}
                placeholder='Nome do comprador'
              />
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <NumberInput
                name={'value'}
                title={'Valor (R$)'}
                min={0.01}
                step={0.01}
              />
              <NumberInput
                name={'valuePaid'}
                title={<>Valor pago (R$) <span className='text-muted-foreground text-xs'>(opcional)</span></>}
              />
            </div>

            <div className='grid grid-cols-1'>
              <DateInput
                name='bookingDate'
                title={<>Data da reserva <span className='text-muted-foreground text-xs'>(opcional)</span></>}
              />
            </div>

            <div className='grid grid-cols-1'>
              <DateInput
                name='saleDate'
                title={<>Data da venda <span className='text-muted-foreground text-xs'>(opcional)</span></>}
              />
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <NumberInput
                name='installments'
                title='Parcelas'
                min={1}
                step={1}
              />
              <div className='flex items-center  gap-2 pt-4'>
                <CheckboxInput
                  name='paid'
                  label='Pago'
                />
              </div>
              <div className='flex items-center gap-2 pt-4'>
                <CheckboxInput
                  name='delivered'
                  label='Entregue'
                />
              </div>
            </div>
            <div className='flex items-center gap-6'>

            </div>

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
