import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { useFormContext } from 'react-hook-form';
import { Label } from '../label';

interface SelectInputProps<T> {
    options: T[]
    defaultValue: string
    placeholder?: string
    name: string
    title: string
}

export function SelectInput<T extends { value: string; label: string }>({
    options,
    defaultValue,
    placeholder = 'Selecione',
    title,
    name,
}: SelectInputProps<T>) {
    const { setValue, watch, formState: { errors } } = useFormContext(); // Ensure this component is used within a FormProvider
    const value = watch(name) || defaultValue;
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className='space-y-1'>
            <Label>{title}</Label>
            <Select value={value} onValueChange={(v) => setValue(name, v ?? '')}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors[name] && (
                <p className='text-xs text-red-500'>
                    {typeof errors[name]?.message === 'string' ? errors[name].message : 'Valor inválido'}
                </p>
            )}
        </div>
    );
}   