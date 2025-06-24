import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldError, useController, Control } from "react-hook-form";

interface OptionItem {
    label: string;
    value: string | number | boolean;
}

interface CheckboxGroupFieldProps {
    id: string;
    label: string;
    options: OptionItem[];
    control: Control<any>; // generic type tùy bạn
    name: string;
    error?: FieldError;
    className?: string;
}

export default function CheckboxGroupField({
    id,
    label,
    options,
    control,
    name,
    error,
    className = "",
}: CheckboxGroupFieldProps) {
    const {
        field: { value = [], onChange },
    } = useController({
        name,
        control,
    });

    const handleCheckboxChange = (checked: boolean, optionValue: OptionItem["value"]) => {
        if (checked) {
            onChange([...value, optionValue]);
        } else {
            onChange(value.filter((val: any) => val !== optionValue));
        }
    };

    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id} className="text-base">{label}</Label>
            <div className="grid md:grid-cols-3 gap-4 border rounded-md p-4">
                {options.map((option) => {
                    const checked = value?.includes(option.value);
                    return (
                        <label key={option.value.toString()} className="flex items-center gap-2">
                            <Checkbox
                                id={`${id}-${option.value}`}
                                checked={checked}
                                onCheckedChange={(checked: boolean) =>
                                    handleCheckboxChange(checked, option.value)
                                }
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    );
                })}
            </div>
            <div className="min-h-[18px] transition-all duration-200">
                {error && (
                    <p id={`${id}-error`} className="text-xs text-red-500">
                        {error.message}
                    </p>
                )}
            </div>
        </div>
    );
}
