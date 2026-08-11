'use client'

import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import MarketItemsForm from './MarketItemsForm'
import { useCreateExpense } from '@/hooks/mutations/expenses/use-create-expense'
import { useUpdateExpense } from '@/hooks/mutations/expenses/use-update-expense'
import { expenseSchema, type ExpenseFormData } from '@/lib/schemas/expense.schema'
import { EXPENSE_CATEGORIES } from '@/constants'
import { useCalendar } from '@/store/calendar'
import type { Expense } from '@/types'

interface ExpenseModalProps {
  open: boolean
  expense?: Expense
  onClose: () => void
}

export default function ExpenseModal({ open, expense, onClose }: ExpenseModalProps) {
  const { month, year } = useCalendar()
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const [showMarketItems, setShowMarketItems] = useState(false)
  const isEditing = !!expense

  const methods = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { installments: 1, marketItems: [] },
  })

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = methods

  useEffect(() => {
    if (expense) {
      reset({
        description:  expense.description,
        category:     expense.category,
        responsible:  expense.responsible,
        value:        expense.value,
        installments: expense.installments ?? 1,
        marketItems:  expense.marketItems ?? [],
      })
      setShowMarketItems((expense.marketItems?.length ?? 0) > 0)
    } else {
      reset({ installments: 1, marketItems: [] })
      setShowMarketItems(false)
    }
  }, [expense, reset])

  async function onSubmit(data: ExpenseFormData) {
    try {
      if (isEditing) {
        await updateExpense.mutateAsync({ id: String(expense._id), ...data })
        toast.success('Despesa atualizada')
      } else {
        await createExpense.mutateAsync({ ...data, month, year })
        toast.success('Despesa criada')
      }
      onClose()
    } catch {
      toast.error('Erro ao salvar despesa')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar despesa' : 'Nova despesa'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Descrição</Label>
              <Input {...register('description')} placeholder="Ex: Supermercado" />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Categoria</Label>
                <Select
                  defaultValue={expense?.category}
                  onValueChange={(v) => setValue('category', v as ExpenseFormData['category'])}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((c) => (
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

            <Separator />

            <div>
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2"
                onClick={() => setShowMarketItems((v) => !v)}
              >
                {showMarketItems ? 'Ocultar itens do mercado' : 'Adicionar itens do mercado'}
              </button>
            </div>

            {showMarketItems && <MarketItemsForm />}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
