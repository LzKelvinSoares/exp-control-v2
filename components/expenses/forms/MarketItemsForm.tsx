'use client'

import { useFieldArray, useFormContext, useWatch, useFormState, Control } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CURRENCY_SYMBOLS, UNITS_OF_MEASURE } from '@/constants'
import type { ExpenseFormData } from '@/lib/schemas/expense.schema'
import { NumberInput } from '@/components/ui/inputs/number-input'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { SelectInput } from '@/components/ui/inputs/select-input'
import { UnitOption } from '@/types/app-types'
import { TextInput } from '@/components/ui/inputs/text-input'

interface ItemRowProps {
  index: number
  control: Control<ExpenseFormData>
  onRemove: () => void
}

function ItemRow({ index, control, onRemove }: ItemRowProps) {
  const { currency } = useCurrencySession()
  const { setValue } = useFormContext<ExpenseFormData>()
  const qty = useWatch({ control, name: `marketItems.${index}.quantity` })
  const val = useWatch({ control, name: `marketItems.${index}.value` })

  function recalc(q: number, v: number) {
    if (q > 0 && v > 0) {
      setValue(`marketItems.${index}.valuePerUnit`, parseFloat((v / q).toFixed(3)))
    }
  }

  return (
    <div className='grid grid-flow-col grid-rows-2 gap-4 items-end p-3 bg-slate-50 rounded-lg'>
      <div className='grid grid-flow-col col-span-4 gap-2'>
        <div className='col-span-2'>
          <TextInput
            name={`marketItems.${index}.description`}
            title={'Descrição'}
            placeholder='Item'
          />
        </div>
        <div className='col-span-1'>
          <NumberInput
            className='h-8 text-sm'
            name={`marketItems.${index}.value`}
            title={`Valor (${CURRENCY_SYMBOLS[currency || 'BRL']})`}
            min={0.01}
            step={0.01}
            onChange={(e) => recalc(Number(qty ?? 0), Number(e.target.value))}
          />
        </div>
      </div>
      <div className='grid grid-flow-col col-span-4 gap-2'>
        <SelectInput<UnitOption>
          name={`marketItems.${index}.unit`}
          title='Unidade'
          options={UNITS_OF_MEASURE}
          defaultValue='UN'
        />
        <NumberInput
          name={`marketItems.${index}.quantity`}
          title={'Qtd'}
          min={0.01}
          step={0.01}
          onChange={(e) => recalc(Number(e.target.value), Number(val ?? 0))}
        />
        <div className='col-span-1 flex justify-end items-center pt-4'>
          <Button type='button' variant='ghost' size='icon' onClick={onRemove} className='h-8 w-8 text-red-500'>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MarketItemsForm() {
  const { control } = useFormContext<ExpenseFormData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'marketItems' })
  const { errors } = useFormState({ control })

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Label className='text-sm font-medium'>Itens do mercado</Label>
        <Button
          type='button' variant='outline' size='sm'
          onClick={() => append({ description: '', quantity: 1, unit: 'UN', value: 0, valuePerUnit: 0 })}
        >
          <Plus size={14} className='mr-1' /> Adicionar item
        </Button>
      </div>

      {fields.map((field, i) => (
        <ItemRow key={field.id} index={i} control={control} onRemove={() => remove(i)} />
      ))}

      {errors.marketItems && (
        <p className='text-xs text-red-500'>Verifique os itens do mercado</p>
      )}
    </div>
  )
}
