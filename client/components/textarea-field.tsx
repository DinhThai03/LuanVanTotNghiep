import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextareaFieldProps {
    id: string;
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    placeholder?: string;
    className?: string;
    readOnly?: boolean;
    disabled?: boolean;
    rows?: number;
}

export default function TextareaField({
    id,
    label,
    register,
    error,
    placeholder,
    className = "",
    readOnly,
    disabled,
    rows = 4,
}: TextareaFieldProps) {
    return (
        <div className={`grid gap-3 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                placeholder={placeholder}
                rows={rows}
                {...register}
                readOnly={readOnly}
                disabled={disabled}
                className={`${readOnly ? "opacity-50" : ""}`}
            />
            <div className="min-h-[18px] transition-all duration-200">
                {error && <p className="text-xs text-red-500">{error.message}</p>}
            </div>
        </div>
    );
}
