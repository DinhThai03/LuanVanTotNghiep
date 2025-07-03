"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

import InputField from "../input-field";
import { cn } from "@/lib/utils";
import PasswordField from "../password-field";
import { changePassword } from "@/features/auth/api";
// import { changePassword } from "@/features/auth/api"; // API đổi mật khẩu nếu có

const schema = z
    .object({
        current_password: z.string().min(6, "Mật khẩu cũ tối thiểu 6 ký tự"),
        password: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
        password_confirmation: z.string().min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["password_confirmation"],
    });

type FormValues = z.infer<typeof schema>;

const ChangePasswordForm = () => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("current_password", data.current_password);
            formData.append("password", data.password);
            formData.append("password_confirmation", data.password_confirmation);

            await changePassword(formData);
            toast.success("Đổi mật khẩu thành công!");
            reset();
        } catch (err: any) {
            // Xử lý lỗi nếu có
            toast.error("Đổi mật khẩu thất bại", {
                description: "Mật khẩu hiện tại không đúng.",
            });

            // Ví dụ setError từ API
            // setError("current_password", { message: "Mật khẩu cũ không đúng" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-xl px-6">
            <h2 className="text-2xl font-bold text-center mb-4">Đổi mật khẩu</h2>

            <div className="grid grid-cols-1 gap-4">
                <PasswordField
                    id="current_password"
                    label="Mật khẩu cũ"
                    register={register("current_password")}
                    error={errors.current_password}
                />
                <PasswordField
                    id="password"
                    label="Mật khẩu mới"
                    register={register("password")}
                    error={errors.password}
                />
                <PasswordField
                    id="password_confirmation"
                    label="Xác nhận mật khẩu"
                    register={register("password_confirmation")}
                    error={errors.password_confirmation}
                />
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className={cn(
                        "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition",
                        { "opacity-50 pointer-events-none": loading }
                    )}
                >
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
