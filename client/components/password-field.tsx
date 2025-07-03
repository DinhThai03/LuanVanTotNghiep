import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordFieldProps {
    register: UseFormRegisterReturn;
    error?: FieldError;
    label?: string;
    forgotPasswordLink?: string | null;   // cho phép ẩn link nếu truyền null
    id?: string;
    placeholder?: string;
    className?: string;
}

export default function PasswordField({
    register,
    error,
    label = "Mật khẩu",
    forgotPasswordLink = "",
    id = "password",
    placeholder = "Nhập mật khẩu",
    className = "",
}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`grid gap-3 ${className}`}>
            {/* Tiêu đề + link quên mật khẩu */}
            <div className="flex items-center">
                <Label htmlFor={id}>{label}</Label>
                {forgotPasswordLink && (
                    <a
                        href={forgotPasswordLink}
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                        Quên mật khẩu?
                    </a>
                )}
            </div>

            {/* Ô nhập + nút hiện/ẩn mật khẩu */}
            <div className="relative">
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    {...register}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                    {showPassword ? (
                        <Eye className="w-5 h-5" />
                    ) : (
                        <EyeOff className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Vùng hiển thị lỗi có chiều cao cố định */}
            <div className="min-h-[18px] transition-all duration-200">
                {error && <p className="text-xs text-red-500">{error.message}</p>}
            </div>
        </div>
    );
}
