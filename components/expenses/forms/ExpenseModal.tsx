'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import MarketItemsForm from './MarketItemsForm'
import { useCreateExpense } from '@/hooks/mutations/expenses/use-create-expense'
import { useUpdateExpense } from '@/hooks/mutations/expenses/use-update-expense'
import { expenseSchema, type ExpenseFormData } from '@/lib/schemas/expense.schema'
import { toDateInput, fromDateInput } from '@/lib/utils'
import { CURRENCY_SYMBOLS, EXPENSE_CATEGORIES } from '@/constants'
import { CategoryOption, Expense, ExpenseCategory } from '@/types/app-types'
import { SelectInput } from '@/components/ui/inputs/select-input'
import { NumberInput } from '@/components/ui/inputs/number-input'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { DateInput } from '@/components/ui/inputs/date-input'
import { TextInput } from '@/components/ui/inputs/text-input'

interface ExpenseModalProps {
  open: boolean
  expense?: Expense
  onClose: () => void
}

export default function ExpenseModal({ open, expense, onClose }: ExpenseModalProps) {
  const { currency } = useCurrencySession()
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const isEditing = !!expense?.id
  const [showMarketItems, setShowMarketItems] = useState((expense?.marketItems?.length ?? 0) > 0)

  const defaultValues: ExpenseFormData = expense
    ? {
        description: expense.description,
        type: expense.type,
        responsible: expense.responsible,
        value: expense.value,
        monthsLeft: expense.monthsLeft ?? 1,
        marketItems: expense.marketItems ?? [],
        firstExpirationDate: toDateInput(expense.firstExpirationDate),
      }
    : {
        description: '',
        type: '',
        responsible: '',
        value: 0,
        monthsLeft: 1,
        marketItems: [],
        firstExpirationDate: toDateInput(new Date()),
      }

  const methods = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  })

  const { handleSubmit, formState: { isSubmitting } } = methods

  async function onSubmit(data: ExpenseFormData) {
    try {
      const firstExpirationDate = fromDateInput(data.firstExpirationDate)
      if (isEditing) {
        await updateExpense.mutateAsync({ id: String(expense.id), ...data, firstExpirationDate })
        toast.success('Despesa atualizada')
      } else {
        await createExpense.mutateAsync({ ...data, firstExpirationDate })
        toast.success('Despesa criada')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar despesa')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar despesa' : 'Nova despesa'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <TextInput
              name='description'
              title='Descrição'
              placeholder='Ex: Supermercado'
            />

            <div className='grid grid-cols-2 gap-3'>
              <SelectInput<CategoryOption<ExpenseCategory>>
                name='type'
                title='Categoria'
                options={EXPENSE_CATEGORIES}
                defaultValue={expense?.type ?? ''}
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

            <Separator />

            <div>
              <button
                type='button'
                className='text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2'
                onClick={() => setShowMarketItems((v) => !v)}
              >
                {showMarketItems ? 'Ocultar itens do mercado' : 'Adicionar itens do mercado'}
              </button>
            </div>

            {showMarketItems && <MarketItemsForm />}

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
