import { useFormContext } from 'react-hook-form';
import { Label } from '../label';
import { Input } from '../input';
import { ReactNode } from 'react';

interface TextInputProps {
    name: string;
    title: ReactNode;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function TextInput({
    name,
    title,
    placeholder,
    onChange,
    className,
}: TextInputProps) {
    const { register, formState: { errors } } = useFormContext(); // Ensure this component is used within a FormProvider

    return (
        <div className='space-y-1'>
            <Label>{title}</Label>
            <Input
                type='text'
                placeholder={placeholder}
                {...register(name, { onChange })}
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