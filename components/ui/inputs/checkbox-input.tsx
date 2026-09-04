import { useFormContext } from 'react-hook-form';
import { Checkbox } from '../checkbox';
import { Label } from '../label';

interface CheckboxInputProps {
    name: string;
    label: string;
}

export function CheckboxInput({ name, label }: CheckboxInputProps) {
    const { setValue, watch } = useFormContext(); // Ensure this component is used within a FormProvider
    const checked = watch(name);

    return (
        <>
            <Checkbox
                id={name}
                checked={checked}
                onCheckedChange={(v) => setValue(name, !!v)}
            />
            <Label htmlFor={name}>{label}</Label>
        </>
    );
}