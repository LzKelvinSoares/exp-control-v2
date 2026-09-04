import { NumberInput } from '@/components/ui/inputs/number-input';
import { CURRENCY_SYMBOLS } from '@/constants';
import { useCurrencySession } from '@/hooks/use-currency-session';
import { FuelFormData } from '@/lib/schemas/fuel.schema';
import { useFormContext } from 'react-hook-form';
import { DateInput } from '@/components/ui/inputs/date-input';

export function FuelFormContent() {
    const { currency } = useCurrencySession()
    const { watch } = useFormContext<FuelFormData>()

    const value = watch('value')
    const valuePerLiter = watch('valuePerLiter')
    const liters = value > 0 && valuePerLiter > 0
        ? (value / valuePerLiter).toFixed(3)
        : '—'

    return (
        <>
            <DateInput
                name='creationDate'
                title='Data'
            />

            <div className='grid grid-cols-2 gap-3'>
                <NumberInput
                    name='value'
                    title={`Custo total (${CURRENCY_SYMBOLS[currency || 'BRL']})`}
                    min={0.01}
                    step={0.01}
                />

                <NumberInput
                    name='valuePerLiter'
                    title={`Preço por litro (${CURRENCY_SYMBOLS[currency || 'BRL']})`}
                    min={0.001}
                    step={0.001}
                />
            </div>

            <div className='flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600'>
                <span>Litros calculados:</span>
                <span className='font-semibold text-foreground'>{liters} L</span>
            </div>
        </>
    )
}