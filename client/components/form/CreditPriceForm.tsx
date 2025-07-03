"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import SelectField from "../select-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AcademicYearData } from "@/types/AcademicYearType";
import { CreditPriceData } from "@/types/CreditPriceType";
import { addCreditPrice, updateCreditPrice } from "@/services/CreditPrice";
import { getAcademicYears } from "@/services/AcademicYear";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Schema validation
const schema = z.object({
    id: z.number().optional(),
    subject_type: z.enum(["LT", "TH"], {
        required_error: "Vui lòng chọn loại môn học",
    }),
    price_per_credit: z
        .number({ invalid_type_error: "Giá mỗi tín chỉ phải là số" })
        .min(0, "Giá mỗi tín chỉ phải lớn hơn hoặc bằng 0"),
    is_active: z.boolean(),
    academic_year_id: z
        .number({
            required_error: "Vui lòng chọn năm học",
            invalid_type_error: "Vui lòng chọn năm học",
        })
        .min(1, "Vui lòng chọn năm học"),
});

type FormData = z.infer<typeof schema>;

interface CreditPriceFormProps {
    type: ModalType;
    data?: CreditPriceData;
    onSubmitSuccess?: (data: CreditPriceData) => void;
}

export const CreditPriceForm = ({ type, data, onSubmitSuccess }: CreditPriceFormProps) => {
    const [loading, setLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: data?.id,
            subject_type: data?.subject_type ?? "LT",
            price_per_credit: data?.price_per_credit ?? 0,
            is_active: data?.is_active ?? true,
            academic_year_id: data?.academic_year_id ?? undefined,
        },
    });

    // Load năm học
    useEffect(() => {
        getAcademicYears().then((res) => setAcademicYears(res.data));
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            console.log(formData);
            const form = new FormData();
            form.append("subject_type", formData.subject_type);
            form.append("price_per_credit", formData.price_per_credit.toString());
            form.append("is_active", formData.is_active ? "1" : "0");
            form.append("academic_year_id", formData.academic_year_id.toString());

            let res;
            if (type === "create") {
                res = await addCreditPrice(form);
                toast.success(res.data.message || "Thêm giá tín chỉ thành công");
            } else {
                res = await updateCreditPrice(formData.id!, form);
                toast.success(res.data.message || "Cập nhật giá tín chỉ thành công");
            }

            if (onSubmitSuccess) {
                await onSubmitSuccess(res.data.data);
            }

            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            console.error("Chi tiết lỗi server:", axiosErr.response?.data);

            let message = "Đã có lỗi xảy ra.";
            if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
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
                {type === "create" ? "Thêm giá tín chỉ" : "Cập nhật giá tín chỉ"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                        id="subject_type"
                        label="Loại môn học"
                        register={register("subject_type")}
                        error={errors.subject_type}
                        options={[
                            { label: "Lý thuyết", value: "LT" },
                            { label: "Thực hành", value: "TH" },
                        ]}
                    />

                    <InputField
                        id="price_per_credit"
                        label="Giá mỗi tín chỉ"
                        type="number"
                        register={register("price_per_credit", { valueAsNumber: true })}
                        error={errors.price_per_credit}
                    />

                    <SelectField
                        id="academic_year_id"
                        label="Năm học áp dụng"
                        register={register("academic_year_id", { valueAsNumber: true })}
                        error={errors.academic_year_id}
                        options={academicYears.map((year) => ({
                            label: `${year.start_year} - ${year.end_year}`,
                            value: year.id.toString(),
                        }))}
                    />
                    <div></div>

                    <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                            id="is_active"
                            checked={watch("is_active")}
                            onCheckedChange={(checked) =>
                                setValue("is_active", Boolean(checked))
                            }
                        />
                        <Label htmlFor="is_active">Áp dụng</Label>
                    </div>
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
