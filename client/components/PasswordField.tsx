import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordFieldProps {
    register: UseFormRegisterReturn;
    error?: FieldError;
    label?: string;
    forgotPasswordLink?: string;
    id?: string;
    className?: string;
}

export default function PasswordField({
    register,
    error,
    label = "Mật khẩu",
    forgotPasswordLink = "#",
    id = "password",
    className = "",
}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`grid gap-3 ${className}`}>
            <div className="flex items-center">
                <Label htmlFor={id}>{label}</Label>
                <a
                    href={forgotPasswordLink}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                    Quên mật khẩu?
                </a>
            </div>
            <div className="relative">
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    {...register}
                    className="pr-10"
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                >
                    {showPassword ? <Eye className="w-5 h-5 cursor-pointer" /> : <EyeOff className="w-5 h-5 cursor-pointer" />}
                </button>
            </div>
            {error && (
                <p className="text-xs text-red-400">{error.message}</p>
            )}
        </div>
    );
}
