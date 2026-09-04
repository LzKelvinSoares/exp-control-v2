import { useFormContext } from 'react-hook-form';
import { Label } from '../label';
import { Input } from '../input';
import { ReactNode } from 'react';

interface DateInputProps {
    name: string;
    title: ReactNode;
    min?: string;
    max?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function DateInput({
    name,
    title,
    min,
    max,
    onChange,
    className,
}: DateInputProps) {
    const { register, formState: { errors } } = useFormContext(); // Ensure this component is used within a FormProvider

    return (
        <div className='space-y-1'>
            <Label>{title}</Label>
            <Input
                type='date'
                min={min}
                max={max}
                {...register(name, { onChange })}
                className={className}
            />
            {errors[name] && (
                <p className='text-xs text-red-500'>
                    {typeof errors[name]?.message === 'string' ? errors[name].message : 'Data inválida'}
                </p>
            )}
        </div>
    );
}