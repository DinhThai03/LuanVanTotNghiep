"use client";

import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { SemesterData } from "@/types/SemesterType";
import { AcademicYearData } from "@/types/AcademicYearType";
import { addSemester, updateSemester } from "@/services/Semesters";
import { getAcademicYears } from "@/services/AcademicYear";
import SearchableSelect from "../searchable-select-field";
import SearchableSelectField from "../searchable-select-field";
import SelectField from "../select-field";

const baseSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Tên học kỳ không được để trống"),
    start_date: z.string().min(1, "Ngày bắt đầu không được để trống"),
    end_date: z.string().min(1, "Ngày kết thúc không được để trống"),
    academic_year_id: z.number({ invalid_type_error: "Vui lòng chọn niên khóa" }),
});

const createSchema = baseSchema.superRefine((data, ctx) => {
    if (new Date(data.end_date) <= new Date(data.start_date)) {
        ctx.addIssue({
            path: ["end_date"],
            code: z.ZodIssueCode.custom,
            message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
    }
});

const updateSchema = createSchema;

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;
type FormData = CreateFormData | UpdateFormData;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("name", fd.name);
    form.append("start_date", fd.start_date);
    form.append("end_date", fd.end_date);
    form.append("academic_year_id", fd.academic_year_id.toString());
    return form;
};

interface SemesterFormProps {
    type: ModalType;
    data?: SemesterData;
    onSubmitSuccess?: (semester: SemesterData) => void;
}

export const SemesterForm = ({
    type,
    data,
    onSubmitSuccess,
}: SemesterFormProps) => {
    const [loading, setLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
        control,
    } = useForm<FormData>({
        resolver: zodResolver(type === "create" ? createSchema : updateSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name ?? "Học kỳ 1",
            start_date: data?.start_date ?? "",
            end_date: data?.end_date ?? "",
            academic_year_id: data?.academic_year.id ?? undefined,
        },
    });

    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                setLoading(true);
                const res = await getAcademicYears();
                if (res) {
                    setAcademicYears(res.data);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message = "Đã có lỗi xảy ra khi lấy danh sách niên khóa.";
                if (axiosErr.response?.data?.message) {
                    message = axiosErr.response.data.message;
                } else if (axiosErr.response?.data?.error) {
                    message = axiosErr.response.data.error;
                } else if (axiosErr.message === "Network Error") {
                    message = "Không thể kết nối đến server.";
                }
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAcademicYears();
    }, []);

    useEffect(() => {
        if (type === "create" && academicYears.length > 0) {
            reset((prev) => ({
                ...prev,
                academic_year_id: academicYears[academicYears.length - 1].id,
            }));
        }
    }, [academicYears, type]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addSemester(buildFormData(formData));
                toast.success(res.data.message || "Thêm học kỳ thành công");
            } else {
                res = await updateSemester(formData.id!, buildFormData(formData));
                toast.success(res.data.message || "Cập nhật học kỳ thành công");
            }
            onSubmitSuccess?.(res.data.data);
            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            console.error("Chi tiết lỗi:", axiosErr.response?.data);

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
                description: "Vui lòng kiểm tra lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm học kỳ" : "Cập nhật học kỳ"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                        id="name"
                        label="Trạng thái"
                        options={[
                            { label: "Học kỳ 1", value: 'Học kỳ 1' },
                            { label: "Học kỳ 2", value: 'Học kỳ 2' },
                            { label: "Học kỳ Hè", value: "Học kỳ hè" },
                        ]}
                        register={register("name")}
                        error={errors.name}
                    />

                    <SearchableSelectField
                        id="academic_year_id"
                        name="academic_year_id"
                        label="Niên khóa"
                        control={control}
                        options={academicYears.map((year) => ({
                            label: year.name,
                            value: year.id,
                        }))}
                        placeholder="Chọn niên khóa…"
                        error={errors.academic_year_id}
                    />

                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <InputField
                        id="start_date"
                        label="Ngày bắt đầu"
                        type="date"
                        register={register("start_date")}
                        error={errors.start_date}
                    />
                    <InputField
                        id="end_date"
                        label="Ngày kết thúc"
                        type="date"
                        register={register("end_date")}
                        error={errors.end_date}
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
