"use client";

import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { getStudents } from "@/services/Student";
import { getLessons } from "@/services/Lesson";
import { addRegistration, updateRegistration } from "@/services/Registration";

import SelectField from "../select-field";
import SearchableSelectField from "../searchable-select-field";
import { cn } from "@/lib/utils";
import { RegistrationData } from "@/types/RegistrationType";

// Schema
const baseSchema = z.object({
    id: z.number().optional(),
    status: z.string().min(1, "Trạng thái là bắt buộc."),
    student_code: z.string().min(1, "Mã sinh viên là bắt buộc."),
    lesson_id: z.coerce.number().min(1, "Buổi học là bắt buộc."),
});

const createSchema = baseSchema;
const updateSchema = baseSchema;

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;
type FormData = CreateFormData | UpdateFormData;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("status", fd.status);
    form.append("student_code", fd.student_code);
    form.append("lesson_id", fd.lesson_id.toString());
    return form;
};

interface RegistrationFormProps {
    type: ModalType;
    data?: FormData;
    onSubmitSuccess?: (registration: RegistrationData) => void;
}

export const RegistrationForm = ({
    type,
    data,
    onSubmitSuccess,
}: RegistrationFormProps) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<{ label: string; value: string }[]>([]);
    const [lessons, setLessons] = useState<{ label: string; value: number }[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(type === "create" ? createSchema : updateSchema),
        defaultValues: {
            id: data?.id,
            status: data?.status ?? "approved",
            student_code: data?.student_code ?? "",
            lesson_id: data?.lesson_id ?? undefined,
        }
    });

    // Fetch danh sách sinh viên và buổi học
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentRes, lessonRes] = await Promise.all([
                    getStudents(),
                    getLessons(),
                ]);

                setStudents(
                    studentRes.map((s: any) => ({
                        label: `${s.user.last_name} ${s.user.first_name} (${s.code})`,
                        value: s.code,
                    }))
                );

                setLessons(
                    lessonRes.data.map((l: any) => ({
                        label: `${l.teacher_subject.subject.name} - ${l.teacher_subject.teacher.user.last_name} ${l.teacher_subject.teacher.user.first_name} - ${l.room.name} (${l.start_time} - ${l.end_time}) - ${l.semester.name} (${l.semester.academic_year.start_year} - ${l.semester.academic_year.end_year})`,
                        value: l.id,
                    }))
                );
            } catch (err) {
                toast.error("Không thể tải danh sách sinh viên hoặc buổi học.");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addRegistration(buildFormData(formData));
                toast.success(res.data.message || "Thêm đăng ký thành công");
            } else {
                res = await updateRegistration(formData.id!, buildFormData(formData));
                toast.success(res.data.message || "Cập nhật đăng ký thành công");
            }

            onSubmitSuccess?.(res.data.data); // ✅ truyền dữ liệu trả về
            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            console.error("Chi tiết lỗi:", axiosErr.response?.data);

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

            toast.error("Đã xảy ra lỗi khi gửi dữ liệu", {
                description: "Vui lòng kiểm tra lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm đăng ký học phần" : "Cập nhật đăng ký học phần"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-1 gap-4">
                    {type === "update" && (
                        <SelectField
                            id="status"
                            label="Trạng thái"
                            options={[
                                { label: "Chờ duyệt", value: "pending" },
                                { label: "Đã duyệt", value: "approved" },
                                { label: "Từ chối", value: "canceled" },
                                { label: "Hoàn thành", value: "completed" },
                            ]}
                            register={register("status")}
                            error={errors.status}
                        />)}

                    <SearchableSelectField
                        id="student_code"
                        name="student_code"
                        label="Sinh viên"
                        control={control}
                        options={students}
                        placeholder="Chọn sinh viên..."
                        error={errors.student_code}
                    />
                </div>

                <SearchableSelectField
                    id="lesson_id"
                    name="lesson_id"
                    label="Buổi học"
                    control={control}
                    options={lessons}
                    placeholder="Chọn buổi học..."
                    error={errors.lesson_id}
                />

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
                                ? "Tạo đăng ký"
                                : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
};
