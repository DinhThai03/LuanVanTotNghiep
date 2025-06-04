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
}

export default function InputField({
    id,
    label,
    register,
    error,
    type = "text",
    placeholder,
    className = "",
}: InputFieldProps) {
    return (
        <div className={`grid gap-3 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register}
            />
            {error && (
                <p className="text-xs text-red-400">{error.message}</p>
            )}
        </div>
    );
}
