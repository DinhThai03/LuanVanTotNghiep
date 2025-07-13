"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../input-field";
import SelectField from "../select-field";
import { z } from "zod";
import { toast } from "sonner";
import { ModalType } from "./FormModal";
import { SemesterSubjectData } from "@/types/SemesterSubjectType";
import { addExamSchedule, updateExamSchedule } from "@/services/ExamSchedule";
import { getSemesterSubjects } from "@/services/SemesterSubjects";


// Hàm parse "HH:mm" thành số phút từ 00:00
const parseTimeToMinutes = (time: string): number | null => {
    const [hour, minute] = time.split(":").map(Number);
    if (
        isNaN(hour) || isNaN(minute) ||
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59
    ) return null;
    return hour * 60 + minute;
};

export const examScheduleSchema = z.object({
    id: z.coerce.number().optional(),

    exam_date: z
        .string()
        .min(1, "Vui lòng chọn ngày thi")
        .refine((val) => {
            const examDate = new Date(val);
            const today = new Date();
            return examDate >= today;
        }, {
            message: "Ngày thi không được sau thời điểm hiện tại",
        }),

    exam_time: z
        .string()
        .min(1, "Vui lòng nhập giờ thi")
        .refine((val) => /^([01]\d|2[0-3]):[0-5]\d$/.test(val), {
            message: "Giờ thi không hợp lệ, định dạng phải là HH:mm (vd: 08:00)",
        }),

    duration: z.coerce.number().min(1, "Thời lượng phải >= 1"),

    is_active: z.union([z.literal(true), z.literal(false), z.number()]),

    semester_subject_id: z.coerce.number({
        required_error: "Vui lòng chọn học phần học kỳ",
    }),
}).refine((data) => {
    const start = parseTimeToMinutes(data.exam_time);
    if (start === null) return false;
    const end = start + data.duration;

    const workStart = 7 * 60;   // 7:00 AM
    const workEnd = 17 * 60;    // 5:00 PM

    return start >= workStart && end <= workEnd;
}, {
    message: "Giờ thi và thời lượng phải nằm trong khoảng 07:00 đến 17:00",
    path: ["exam_time"], // Gắn lỗi vào trường giờ thi
});


type ExamScheduleFormValues = z.infer<typeof examScheduleSchema>;

interface ExamScheduleFormProps {
    type: ModalType;
    data?: ExamScheduleFormValues;
    onSubmitSuccess?: (data: any) => void;
}

export const ExamScheduleForm = ({ type, data, onSubmitSuccess }: ExamScheduleFormProps) => {
    const [loading, setLoading] = useState(false);
    const [semesterSubjects, setSemesterSubjects] = useState<SemesterSubjectData[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<ExamScheduleFormValues>({
        resolver: zodResolver(examScheduleSchema),
        defaultValues: {
            id: data?.id,
            exam_date: data?.exam_date ?? "",
            exam_time: data?.exam_time ?? "",
            duration: data?.duration ?? 90,
            is_active: data?.is_active ?? true,
            semester_subject_id: data?.semester_subject_id ?? 1,
        },
    });

    useEffect(() => {
        const fetchSemesterSubjects = async () => {
            try {
                const res = await getSemesterSubjects();
                setSemesterSubjects(res.data || []);
            } catch {
                toast.error("Không thể tải học phần học kỳ");
            }
        };
        fetchSemesterSubjects();
    }, []);

    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data, reset]);

    const buildFormData = (data: ExamScheduleFormValues): FormData => {
        const form = new FormData();
        if (data.id) form.append("id", data.id.toString());
        form.append("exam_date", data.exam_date);
        form.append("exam_time", data.exam_time);
        form.append("duration", data.duration.toString());
        form.append("is_active", String(data.is_active ? 1 : 0));
        form.append("semester_subject_id", data.semester_subject_id.toString());
        return form;
    };

    const onSubmit: SubmitHandler<ExamScheduleFormValues> = async (formData) => {
        setLoading(true);
        try {
            const payload = buildFormData(formData);
            let res;
            if (type === "create") {
                res = await addExamSchedule(payload);
                toast.success("Tạo lịch thi thành công");
            } else {
                res = await updateExamSchedule(formData.id!, payload);
                toast.success("Cập nhật lịch thi thành công");
            }
            onSubmitSuccess?.(res.data.data);
            reset();
        } catch (err: any) {
            if (err?.response?.status === 422 && err?.response.data?.errors) {
                Object.entries(err.response.data.errors).forEach(([field, msgs]) => {
                    setError(field as keyof ExamScheduleFormValues, {
                        type: "server",
                        message: (msgs as string[])[0],
                    });
                });
            }
            toast.error("Có lỗi xảy ra", {
                description: err?.response?.data?.message || "Vui lòng thử lại",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 p-4">
            <InputField
                id="exam_date"
                label="Ngày thi"
                type="date"
                register={register("exam_date")}
                error={errors.exam_date}
            />
            <InputField
                id="exam_time"
                label="Giờ thi (hh:mm)"
                type="time"
                register={register("exam_time")}
                error={errors.exam_time}
            />
            <InputField
                id="duration"
                label="Thời lượng (phút)"
                type="number"
                register={register("duration", { valueAsNumber: true })}
                error={errors.duration}
            />
            <SelectField
                id="is_active"
                label="Trạng thái"
                options={[
                    { label: "Đang hoạt động", value: 1 },
                    { label: "Không hoạt động", value: 0 },
                ]}
                register={register("is_active", { valueAsNumber: true })}
                error={errors.is_active}
            />
            <SelectField
                id="semester_subject_id"
                label="Học phần học kỳ"
                options={semesterSubjects.map((ss) => ({
                    label: `${ss.subject.name} - ${ss.semester.name}`,
                    value: ss.id,
                }))}
                register={register("semester_subject_id", { valueAsNumber: true })}
                error={errors.semester_subject_id}
            />

            <div className="col-span-2 mt-4">
                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? "opacity-50 pointer-events-none" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : type === "create" ? "Tạo mới" : "Cập nhật"}
                </button>
            </div>
        </form>
    );
};
