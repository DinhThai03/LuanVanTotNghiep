"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { FacultyData } from "@/types/FacultyType";
import { addFaculty, updateFaculty } from "@/services/Faculty";

// Zod schema
const facultySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Tên khoa không được để trống"),
});

type FormData = z.infer<typeof facultySchema>;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("name", fd.name);
    return form;
};

interface FacultyFormProps {
    type: ModalType;
    data?: FacultyData;
    onSubmitSuccess?: (faculty: FacultyData) => void;
}

export const FacultyForm = ({
    type,
    data,
    onSubmitSuccess,
}: FacultyFormProps) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(facultySchema),
        defaultValues: {
            id: data?.id,
            name: data?.name ?? "",
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addFaculty(buildFormData(formData));
                toast.success(res.data.message || "Thêm khoa thành công");
            } else {
                res = await updateFaculty(formData.id!, buildFormData(formData));
                toast.success(res.data.message || "Cập nhật khoa thành công");
            }
            onSubmitSuccess?.(res.data.data);
            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            console.error("Chi tiết lỗi server:", axiosErr.response?.data);

            let message = "Đã có lỗi xảy ra.";
            if (
                axiosErr.response?.status === 422 &&
                axiosErr.response.data?.errors
            ) {
                const backendErrors = axiosErr.response.data.errors;
                Object.entries(backendErrors).forEach(([field, msgs]) => {
                    setError(field as keyof FormData, {
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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm khoa" : "Cập nhật khoa"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <InputField
                        id="name"
                        label="Tên khoa"
                        type="text"
                        register={register("name")}
                        error={errors.name}
                    />
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className={cn(
                            "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
                            { "opacity-50 pointer-events-none": loading }
                        )}
                    >
                        {loading
                            ? "Đang xử lý..."
                            : type === "create"
                                ? "Tạo mới"
                                : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
};
