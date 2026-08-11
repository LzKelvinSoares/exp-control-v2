'use client'

import { useFieldArray, useFormContext, useWatch, useFormState, Control } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UNITS_OF_MEASURE } from '@/constants'
import type { ExpenseFormData } from '@/lib/schemas/expense.schema'

interface ItemRowProps {
  index: number
  control: Control<ExpenseFormData>
  onRemove: () => void
}

function ItemRow({ index, control, onRemove }: ItemRowProps) {
  const { register, setValue } = useFormContext<ExpenseFormData>()
  const qty = useWatch({ control, name: `marketItems.${index}.quantity` })
  const val = useWatch({ control, name: `marketItems.${index}.value` })

  function recalc(q: number, v: number) {
    if (q > 0 && v > 0) {
      setValue(`marketItems.${index}.valuePerUnit`, parseFloat((v / q).toFixed(3)))
    }
  }

  return (
    <div className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50 rounded-lg">
      <div className="col-span-4">
        <Label className="text-xs">Descrição</Label>
        <Input {...register(`marketItems.${index}.description`)} placeholder="Item" className="h-8 text-sm" />
      </div>
      <div className="col-span-2">
        <Label className="text-xs">Qtd</Label>
        <Input
          type="number" step="0.01"
          {...register(`marketItems.${index}.quantity`, {
            valueAsNumber: true,
            onChange: (e) => recalc(Number(e.target.value), Number(val ?? 0)),
          })}
          className="h-8 text-sm"
        />
      </div>
      <div className="col-span-2">
        <Label className="text-xs">Unidade</Label>
        <Select
          defaultValue="UN"
          onValueChange={(v) => setValue(`marketItems.${index}.unit`, v ?? '')}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS_OF_MEASURE.map((u) => (
              <SelectItem key={u.value} value={u.value}>{u.value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-3">
        <Label className="text-xs">Valor (R$)</Label>
        <Input
          type="number" step="0.01"
          {...register(`marketItems.${index}.value`, {
            valueAsNumber: true,
            onChange: (e) => recalc(Number(qty ?? 0), Number(e.target.value)),
          })}
          className="h-8 text-sm"
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-red-500">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}

export default function MarketItemsForm() {
  const { control } = useFormContext<ExpenseFormData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'marketItems' })
  const { errors } = useFormState({ control })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Itens do mercado</Label>
        <Button
          type="button" variant="outline" size="sm"
          onClick={() => append({ description: '', quantity: 1, unit: 'UN', value: 0, valuePerUnit: 0 })}
        >
          <Plus size={14} className="mr-1" /> Adicionar item
        </Button>
      </div>

      {fields.map((field, i) => (
        <ItemRow key={field.id} index={i} control={control} onRemove={() => remove(i)} />
      ))}

      {errors.marketItems && (
        <p className="text-xs text-red-500">Verifique os itens do mercado</p>
      )}
    </div>
  )
}
