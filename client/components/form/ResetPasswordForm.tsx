"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PasswordField from "@/components/password-field";
import Image from "next/image";
import { AxiosError } from "axios";
import { resetPassword } from "@/features/auth/api";

const schema = z
    .object({
        password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
        password_confirmation: z.string().min(6, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        path: ["password_confirmation"],
        message: "Mật khẩu xác nhận không khớp",
    });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();
            formData.append("email", email!);
            formData.append("token", token!);
            formData.append("password", data.password);
            formData.append("password_confirmation", data.password_confirmation);
            await resetPassword(formData);
            toast.success("Đặt lại mật khẩu thành công");
            router.replace("/login");
        } catch (error) {
            const axiosError = error as AxiosError<{
                message?: string;
                errors?: Record<string, string[]>;
            }>;

            let msg = "Đã có lỗi xảy ra khi đặt lại mật khẩu";

            if (axiosError.response) {
                if (
                    axiosError.response.status === 422 ||
                    axiosError.response.status === 400
                ) {
                    msg =
                        axiosError.response.data?.message ||
                        Object.values(axiosError.response.data?.errors || {})[0]?.[0] ||
                        "Dữ liệu không hợp lệ";
                } else {
                    msg = `Lỗi máy chủ: ${axiosError.response.status}`;
                }
            } else if (axiosError.message) {
                msg = axiosError.message;
            }

            console.error("Lỗi reset password:", error);
            toast.error(msg);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined" && (!token || !email)) {
            toast.error("Liên kết đặt lại mật khẩu không hợp lệ.");
            router.replace("/");
        }
    }, [token, email, router]);

    if (!token || !email) return null;

    return (
        <div className="flex bg-gray-50 justify-center items-center w-full h-screen flex-col gap-6">
            <div className="w-full flex flex-col justify-center items-center h-fit mb-4">
                <div className="flex flex-col w-full max-w-xl">
                    <div className="w-full justify-center flex gap-2">
                        <Image
                            src="/logo.png"
                            width={200}
                            height={200}
                            alt="logo"
                            className="w-30 h-fit"
                            priority
                        />
                        <div>
                            <div className="text-blue-950 text-md">TRƯỜNG ĐẠI HỌC</div>
                            <div className="text-red-500 text-xl font-bold">
                                CÔNG NGHỆ SÀI GÒN
                            </div>
                        </div>
                    </div>
                    <p className="text-lg text-center mt-1 text-gray-500">
                        GIỎI CHUYÊN MÔN - SÁNG TÂM ĐỨC
                    </p>
                </div>
                <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow">
                    <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <PasswordField
                            id="password"
                            register={register("password")}
                            label="Mật khẩu"
                            error={errors.password}
                        />
                        <PasswordField
                            id="password_confirmation"
                            register={register("password_confirmation")}
                            label="Xác nhận mật khẩu"
                            error={errors.password_confirmation}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
