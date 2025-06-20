import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface OptionItem {
    label: string;
    value: string | number;
}

interface SelectFieldProps {
    id: string;
    label: string;
    options: OptionItem[];
    register: UseFormRegisterReturn;
    error?: FieldError;
    className?: string;
}

export default function SelectField({
    id,
    label,
    options,
    register,
    error,
    className = "",
}: SelectFieldProps) {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                {...register}
                className="border px-3 py-2 rounded-md"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="min-h-[18px]">
                {error && <p className="text-xs text-red-500">{error.message}</p>}
            </div>
        </div>
    );
}
