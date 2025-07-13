"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InputField from "@/components/input-field";
import { AxiosError } from "axios";
import Image from "next/image";
import { forgotPassword } from "@/features/auth/api";
import { toast } from "sonner";

const schema = z.object({
    email: z.string().email("Vui lòng nhập email hợp lệ"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setServerMessage(null);

        try {
            await forgotPassword(data.email);
            toast.success("Thành công", { description: "Đã gửi email khôi phục." });
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;

            if (axiosError.response?.status === 422 && axiosError.response.data?.message) {
                setServerMessage({
                    type: "error",
                    message: axiosError.response.data.message,
                });
            } else {
                setServerMessage({
                    type: "error",
                    message: "Không thể gửi yêu cầu. Vui lòng thử lại sau.",
                });
            }
            toast.error("Lỗi", { description: serverMessage?.message })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex bg-gray-50 justify-center items-center w-full h-screen flex-col gap-6`}>
            <div className='flex flex-col w-full max-w-xl'>
                <div className='w-full h-fit mb-4'>
                    <div className='w-full justify-center flex gap-2'>
                        <Image
                            src="/logo.png"
                            width={200}
                            height={200}
                            alt="logo"
                            className='w-30 h-fit'
                            priority
                        />
                        <div >
                            <div className="text-blue-950 text-md">TRƯỜNG ĐẠI HỌC</div>
                            <div className="text-red-500 text-xl font-bold">CÔNG NGHỆ SÀI GÒN</div>
                        </div>
                    </div>
                    <p className='text-lg text-center mt-1 text-gray-500'>GIỎI CHUYÊN MÔN - SÁNG TÂM ĐỨC</p>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Quên mật khẩu</CardTitle>
                        <CardDescription>Nhập email để nhận hướng dẫn khôi phục</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                            <InputField
                                id="email"
                                label="Email"
                                register={register("email")}
                                placeholder="...@gmail.com"
                                error={errors.email}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
