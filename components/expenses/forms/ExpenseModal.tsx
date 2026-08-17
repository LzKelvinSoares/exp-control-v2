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
import { Expense } from '@/types/app-types'

interface ExpenseModalProps {
  open: boolean
  expense?: Expense
  onClose: () => void
}

function toDateInput(d: Date | string) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

function fromDateInput(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toISOString()
}

export default function ExpenseModal({ open, expense, onClose }: ExpenseModalProps) {
  const { month, year } = useCalendar()
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const [showMarketItems, setShowMarketItems] = useState(false)
  const isEditing = !!expense

  const methods = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { monthsLeft: 1, marketItems: [], firstExpirationDate: toDateInput(new Date(year, month - 1, 1)) },
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = methods

  useEffect(() => {
    if (expense) {
      reset({
        description:         expense.description,
        type:                expense.type,
        responsible:         expense.responsible,
        value:               expense.value,
        monthsLeft:          expense.monthsLeft ?? 1,
        marketItems:         expense.marketItems ?? [],
        firstExpirationDate: toDateInput(expense.firstExpirationDate),
      })
      setShowMarketItems((expense.marketItems?.length ?? 0) > 0)
    } else {
      reset({ monthsLeft: 1, marketItems: [], firstExpirationDate: toDateInput(new Date()) })
      setShowMarketItems(false)
    }
  }, [expense, reset, month, year])

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
                  value={watch('type') ?? ''}
                  onValueChange={(v) => setValue('type', v ?? '')}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
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
                <Input type="number" min="1" {...register('monthsLeft', { valueAsNumber: true })} placeholder="1" />
                {errors.monthsLeft && <p className="text-xs text-red-500">{errors.monthsLeft.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Primeiro vencimento</Label>
              <Input
                type="date"
                value={watch('firstExpirationDate') ?? ''}
                onChange={(e) => setValue('firstExpirationDate', e.target.value)}
              />
              {errors.firstExpirationDate && <p className="text-xs text-red-500">{errors.firstExpirationDate.message}</p>}
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
