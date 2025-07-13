"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AcademicYearData } from "@/types/AcademicYearType";
import { addAcademicYear, updateAcademicYear } from "@/services/AcademicYear";

// Zod Schemas
const baseSchema = z.object({
    id: z.number().optional(),
    start_year: z
        .number({ invalid_type_error: "Năm bắt đầu phải là số" })
        .min(1900, "Năm bắt đầu không hợp lệ"),
    end_year: z
        .number({ invalid_type_error: "Năm kết thúc phải là số" })
        .min(1900, "Năm kết thúc không hợp lệ"),
});

const createSchema = baseSchema.superRefine((data, ctx) => {
    if (data.end_year <= data.start_year) {
        ctx.addIssue({
            path: ["end_year"],
            code: z.ZodIssueCode.custom,
            message: "Năm kết thúc phải lớn hơn năm bắt đầu",
        });
    }
});

const updateSchema = baseSchema.superRefine((data, ctx) => {
    if (data.end_year <= data.start_year) {
        ctx.addIssue({
            path: ["end_year"],
            code: z.ZodIssueCode.custom,
            message: "Năm kết thúc phải lớn hơn năm bắt đầu",
        });
    }
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;
type FormData = CreateFormData | UpdateFormData;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("start_year", fd.start_year.toString());
    form.append("end_year", fd.end_year.toString());
    return form;
};

interface AcademicYearFormProps {
    type: ModalType;
    data?: AcademicYearData;
    onSubmitSuccess?: (academicYear: AcademicYearData) => void;
}

export const AcademicYearForm = ({
    type,
    data,
    onSubmitSuccess,
}: AcademicYearFormProps) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(type === "create" ? createSchema : updateSchema),
        defaultValues: {
            id: data?.id,
            start_year: data?.start_year ?? new Date().getFullYear(),
            end_year: data?.end_year ?? new Date().getFullYear() + 1,
        },
    });

    const startYear = watch("start_year");

    // Tự động cập nhật end_year = start_year + 1 khi tạo mới
    useEffect(() => {
        if (type === "create" && typeof startYear === "number" && !isNaN(startYear)) {
            setValue("end_year", startYear + 1);
        }
    }, [startYear, setValue, type]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addAcademicYear(buildFormData(formData));
                toast.success(res.data.message || "Thêm niên khóa thành công");
            } else {
                res = await updateAcademicYear(formData.id!, buildFormData(formData));
                toast.success(res.data.message || "Cập nhật niên khóa thành công");
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
                {type === "create" ? "Thêm niên khóa" : "Cập nhật niên khóa"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-3 gap-4">
                    <InputField
                        id="start_year"
                        label="Năm bắt đầu"
                        type="number"
                        register={register("start_year", { valueAsNumber: true })}
                        error={errors.start_year}
                    />

                    <InputField
                        id="end_year"
                        label="Năm kết thúc"
                        type="number"
                        register={register("end_year", { valueAsNumber: true })}
                        error={errors.end_year}
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
