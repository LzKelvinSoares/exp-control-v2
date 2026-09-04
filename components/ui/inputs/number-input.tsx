import { useFormContext } from 'react-hook-form';
import { Input } from '../input';
import { Label } from '../label';
import { ReactNode } from 'react';

interface NumberInputProps {
    name: string;
    title: ReactNode;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function NumberInput({
    name,
    title,
    min,
    max,
    step,
    onChange,
    className,
}: NumberInputProps) {
    const { register, formState: { errors } } = useFormContext(); // Ensure this component is used within a FormProvider

    return (
        <div className='space-y-1'>
            <Label>{title}</Label>
            <Input 
                type='number'
                min={min} 
                max={max} 
                step={step} 
                placeholder={min !== undefined ? min.toString() : '0'} 
                {...register(name, { valueAsNumber: !!min, onChange })} 
                className={className}
            />
            {errors[name] && (
                <p className='text-xs text-red-500'>
                    {typeof errors[name]?.message === 'string' ? errors[name].message : 'Valor inválido'}
                </p>
            )}
        </div>
    );
}