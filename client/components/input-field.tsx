import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
    id: string;
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    type?: string;
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
    disabled?: boolean;
    step?: string | number;
    min?: number;
    max?: number;
}

export default function InputField({
    id,
    label,
    register,
    error,
    type = "text",
    placeholder,
    className = "",
    readOnly,
    disabled,
    step,
    min,
    max,
}: InputFieldProps) {
    return (
        <div className={`grid gap-3 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register}
                className={` relative ${type === "date" ? "w-full  pr-8" : ""} ${readOnly && "opacity-50"}`}
                readOnly={readOnly}
                disabled={disabled}
                step={step}
                min={min}
                max={max}
            />
            <div className="min-h-[18px] transition-all duration-200">
                {error && (
                    <p className="text-xs text-red-500">{error.message}</p>
                )}
            </div>
        </div>
    );
}
