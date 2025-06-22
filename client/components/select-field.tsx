import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface OptionItem {
    label: string;
    value: string | number | boolean;
}

interface SelectFieldProps {
    id: string;
    label: string;
    options: OptionItem[];
    register: UseFormRegisterReturn;
    error?: FieldError;
    className?: string;
    placeholder?: string;
}

export default function SelectField({
    id,
    label,
    options,
    register,
    error,
    className = "",
    placeholder = "-- Chọn --",
}: SelectFieldProps) {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                {...register}
                className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value.toString()} value={opt.value.toString()}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="min-h-[18px]">
                {error && <p id={`${id}-error`} className="text-xs text-red-500">{error.message}</p>}
            </div>
        </div>
    );
}
