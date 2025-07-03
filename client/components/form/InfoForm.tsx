"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import moment from "moment";

import InputField from "../input-field";
import { cn } from "@/lib/utils";
import { Info } from "@/types/UserType";
import { profile } from "@/features/auth/api";
import { updateUser } from "@/services/User";

const schema = z.object({
    email: z.string().email("Email không hợp lệ"),
    phone: z
        .string()
        .min(10, "Số điện thoại tối thiểu 10 số")
        .max(11, "Tối đa 11 số")
        .regex(/^\d+$/, "Chỉ chứa số"),
});

type InfoFormData = z.infer<typeof schema>;

export default function InfoForm() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<Info | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<InfoFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            phone: "",
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res: Info = await profile();
                setUser(res);
                reset({
                    email: res.email ?? "",
                    phone: res.phone ?? "",
                });
            } catch (err) {
                toast.error("Không thể tải thông tin người dùng.");
            }
        };
        fetchUser();
    }, [reset]);

    const onSubmit: SubmitHandler<InfoFormData> = async (formData) => {
        setLoading(true);
        try {
            const form = new FormData();
            form.append("user_id", user?.id.toString()!);
            form.append("email", formData.email);
            form.append("phone", formData.phone);
            if (user) {
                const res = await updateUser(user.id, form);
                toast.success("Cập nhật thành công!");
            }
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            let message = "Đã có lỗi xảy ra.";

            if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
                const backendErrors = axiosErr.response.data.errors;
                Object.entries(backendErrors).forEach(([field, msgs]) => {
                    setError(field as keyof InfoFormData, {
                        type: "server",
                        message: (msgs as string[])[0],
                    });
                });
            }

            if (axiosErr.response?.data?.message) {
                message = axiosErr.response.data.message;
            } else if (axiosErr.message === "Network Error") {
                message = "Không thể kết nối đến server.";
            }

            toast.error(message, {
                description: "Vui lòng kiểm tra lại",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start bg-white p-4">
            <form className="space-y-6 w-full max-w-xl px-6" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl font-bold text-center mb-4">Cập nhật thông tin liên lạc</h2>

                {user && (
                    <div className="mb-6 space-y-2 text-gray-700 p-4 border rounded-md shadow-sm bg-gray-50">
                        <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">Thông tin cá nhân</h3>
                        <div><strong>Họ & tên:</strong> {user.last_name} {user.first_name}</div>
                        <div><strong>Ngày sinh:</strong> {moment(user.date_of_birth).format("DD/MM/YYYY")}</div>
                        <div><strong>Giới tính:</strong> {user.sex === true ? "Nam" : user.sex === false ? "Nữ" : "Khác"}</div>
                        <div><strong>Địa chỉ:</strong> {user.address}</div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    <InputField id="email" label="Email" register={register("email")} error={errors.email} />
                    <InputField id="phone" label="Số điện thoại" register={register("phone")} error={errors.phone} />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className={cn(
                            "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition",
                            { "opacity-50 pointer-events-none": loading }
                        )}
                    >
                        {loading ? "Đang xử lý..." : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
}
