"use client";

import { z } from "zod";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { SubjectData } from "@/types/SubjectType";
import { addSubject, updateSubject } from "@/services/Subject";
import SelectField from "../select-field";
import { FacultyData } from "@/types/FacultyType";
import { getFacultys } from "@/services/Faculty";
import CheckboxGroupField from "../checkbox-group-field";

const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    code: z.string().length(10, "Mã học phần phải 10 kí tự"),
    name: z.string().min(1, "Tên học phần là bắt buộc"),
    credit: z.coerce.number().min(1, "Số tín chỉ phải lớn hơn 0"),
    tuition_credit: z.coerce.number().min(1, "Số tín chỉ học phí phải lớn hơn 0"),
    process_percent: z.coerce.number().min(0).max(100, "Phần trăm quá trình phải từ 0-100"),
    midterm_percent: z.coerce.number().min(0).max(100, "Phần trăm giữa kì phải từ 0-100"),
    final_percent: z.coerce.number().min(0).max(100, "Phần trăm cuối kì phải từ 0-100"),
    subject_type: z.enum(["LT", "TH", "DA", "KL"], {
        required_error: "Vui lòng chọn phân loại",
        invalid_type_error: "Phân loại không hợp lệ",
    }),
    year: z.coerce.number().min(1).max(4, "Năm học phải từ 1-4"),
    faculty_ids: z
        .array(z.coerce.number().int()).optional(),
});

type FormData = z.infer<typeof subjectSchema>;


interface SubjectFormProps {
    type: ModalType;
    data?: SubjectData;
    onSubmitSuccess?: (subject: SubjectData) => void;
}

export const SubjectForm = ({
    type,
    data,
    onSubmitSuccess,
}: SubjectFormProps) => {
    const [loading, setLoading] = useState(false);
    const [faculties, setFaculties] = useState<FacultyData[]>([]);

    const buildFormData = (fd: FormData) => {
        const form = new FormData();
        if (type === "update")
            form.append("id", fd.id?.toString()!);

        form.append("code", fd.code);
        form.append("name", fd.name);
        form.append("credit", String(fd.credit));
        form.append("tuition_credit", String(fd.tuition_credit));
        form.append("process_percent", String(fd.process_percent));
        form.append("midterm_percent", String(fd.midterm_percent));
        form.append("final_percent", String(fd.final_percent));
        form.append("subject_type", String(fd.subject_type));
        form.append("year", String(fd.year));
        fd.faculty_ids?.forEach(id => form.append("faculty_ids[]", String(id)));
        return form;
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        control,
        reset,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            id: data?.id ?? undefined,
            code: data?.code ?? "",
            name: data?.name ?? "",
            credit: data?.credit ?? 1,
            tuition_credit: data?.tuition_credit ?? 1,
            process_percent: data?.process_percent ?? 30,
            midterm_percent: data?.midterm_percent ?? 30,
            final_percent: data?.final_percent ?? 40,
            subject_type: (data?.subject_type as "LT" | "TH" | "DA" | "KL") ?? "LT",
            year: data?.year ?? 1,
            faculty_ids: data?.faculty_subjects?.map(f => f.faculty_id) ?? [],
        },
    });

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                setLoading(true);
                const res = await getFacultys();
                if (res) {
                    setFaculties(res.data);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message = "Đã có lỗi xảy ra khi lấy danh sách khoa.";
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

        fetchFaculties();
    }, []);

    useEffect(() => {
        if (data) {
            reset({
                id: data.id,
                code: data.code,
                name: data.name,
                credit: data.credit,
                tuition_credit: data.tuition_credit,
                process_percent: data.process_percent,
                midterm_percent: data.midterm_percent,
                final_percent: data.final_percent,
                year: data.year,
                subject_type: data.subject_type as FormData["subject_type"],
                faculty_ids: data.faculty_subjects?.map(f => f.faculty_id) ?? [],
            });
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addSubject(buildFormData(formData));
                toast.success(res.data.message || "Thêm học phần thành công");
            } else {
                res = await updateSubject(data?.id!, buildFormData(formData));
                toast.success(res.data.message || "Cập nhật học phần thành công");
            }
            onSubmitSuccess?.(res.data.data);
            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
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

    const selectedFaculties = watch("faculty_ids") || [];

    const handleFacultyChange = (facultyId: number) => {
        const newSelected = selectedFaculties.includes(facultyId)
            ? selectedFaculties.filter(id => id !== facultyId)
            : [...selectedFaculties, facultyId];
        setValue("faculty_ids", newSelected);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm học phần" : "Cập nhật học phần"}
            </h2>

            <form className="md:grid grid-cols-3 gap-4" onSubmit={handleSubmit(onSubmit)}>
                {type === "create" && <InputField
                    id="code"
                    label="Mã học phần"
                    type="text"
                    register={register("code")}
                    error={errors.code}
                />
                }

                <InputField
                    id="name"
                    label="Tên học phần"
                    type="text"
                    register={register("name")}
                    error={errors.name}
                />

                <InputField
                    id="credit"
                    label="Số tín chỉ"
                    type="number"
                    register={register("credit", { valueAsNumber: true })}
                    error={errors.credit}
                />

                <InputField
                    id="tuition_credit"
                    label="Số tín chỉ học phí"
                    type="number"
                    register={register("tuition_credit", { valueAsNumber: true })}
                    error={errors.tuition_credit}
                />

                <InputField
                    id="process_percent"
                    label="% quá trình"
                    type="number"
                    register={register("process_percent", { valueAsNumber: true })}
                    error={errors.process_percent}
                />

                <InputField
                    id="midterm_percent"
                    label="% giữa kì"
                    type="number"
                    register={register("midterm_percent", { valueAsNumber: true })}
                    error={errors.midterm_percent}
                />

                <InputField
                    id="final_percent"
                    label="% cuối kì"
                    type="number"
                    register={register("final_percent", { valueAsNumber: true })}
                    error={errors.final_percent}
                />

                <SelectField
                    id="subject_type"
                    label="Phân loại"
                    options={[
                        { label: "Lý thuyết", value: "LT" },
                        { label: "Thực hành", value: "TH" },
                        { label: "Đồ án", value: "DA" },
                        { label: "Khóa luận", value: "KL" },
                    ]}
                    register={register("subject_type")}
                    error={errors.subject_type}
                />

                <SelectField
                    id="year"
                    label="Năm học"
                    options={[
                        { label: "Năm 1", value: 1 },
                        { label: "Năm 2", value: 2 },
                        { label: "Năm 3", value: 3 },
                        { label: "Năm 4", value: 4 },
                    ]}
                    register={register("year", { valueAsNumber: true })}
                    error={errors.year}
                />

                <div className='col-span-3'>
                    <CheckboxGroupField
                        id="faculty_ids"
                        label="Khoa liên quan"
                        name="faculty_ids"
                        control={control}
                        options={faculties.map(f => ({
                            label: f.name,
                            value: f.id,
                        }))}
                        error={errors.faculty_ids as FieldError}
                    />
                </div>
                <div className="col-span-3 mt-4">
                    <button
                        type="submit"
                        className={cn(
                            "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
                            { "opacity-50 pointer-events-none": loading }
                        )}
                        disabled={loading}
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