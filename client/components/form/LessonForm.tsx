"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import SelectField from "../select-field";
import SearchableSelectField from "../searchable-select-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { addLesson, updateLesson } from "@/services/Lesson";
import { getSubjectsForLesson } from "@/services/SemesterSubjects";
import { getSemesters } from "@/services/Semesters";
import { getRooms } from "@/services/Room";
import { TeacherSubjectData } from "@/types/TeacherSubjectType";
import { LessonData } from "@/types/LessonType";
import { SemesterData } from "@/types/SemesterType";

const lessonSchema = z.object({
    semester_id: z.coerce.number().min(1, "Chọn học kỳ"),
    start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
    day_of_week: z.coerce.number().min(1).max(7, "Thứ không hợp lệ"),
    start_time: z.string().min(1, "Giờ bắt đầu là bắt buộc"),
    end_time: z.string().min(1, "Giờ kết thúc là bắt buộc"),
    room_id: z.coerce.number().min(1, "Chọn phòng học"),
    is_active: z.coerce.number({
        required_error: "Trạng thái hoạt động là bắt buộc",
        invalid_type_error: "Trạng thái hoạt động không hợp lệ",
    }),
    teacher_subject_id: z.coerce.number().min(1, "Chọn môn giảng dạy"),
});

type FormData = z.infer<typeof lessonSchema>;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("semester_id", fd.semester_id.toString());
    form.append("start_date", fd.start_date);
    form.append("end_date", fd.end_date);
    form.append("day_of_week", String(fd.day_of_week));
    form.append("start_time", fd.start_time);
    form.append("end_time", fd.end_time);
    form.append("room_id", String(fd.room_id));
    form.append("is_active", fd.is_active ? "1" : "0");
    form.append("teacher_subject_id", String(fd.teacher_subject_id));
    return form;
};

interface LessonFormProps {
    type: ModalType;
    data?: LessonData;
    onSubmitSuccess?: (lesson: any) => void;
}

export const LessonForm = ({ type, data, onSubmitSuccess }: LessonFormProps) => {
    const [loading, setLoading] = useState(false);
    const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubjectData[]>([]);
    const [semesters, setSemesters] = useState<SemesterData[]>([]);
    const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
    const [teacherSubjectsLoaded, setTeacherSubjectsLoaded] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            semester_id: data?.semester_id ?? undefined,
            start_date: data?.start_date ?? "",
            end_date: data?.end_date ?? "",
            day_of_week: data?.day_of_week ?? 2,
            start_time: data?.start_time ?? "",
            end_time: data?.end_time ?? "",
            room_id: data?.room_id ?? 1,
            is_active: data ? Number(data.is_active) : 1,
            teacher_subject_id: data?.teacher_subject_id ?? 1,
        },
    });

    const semesterId = watch("semester_id");

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await getSemesters();
                setSemesters(res.data);
                if (type === "create" && res.data.length > 0) {
                    setValue("semester_id", res.data[0].id);
                }
            } catch {
                toast.error("Không thể tải danh sách học kỳ.");
            }
        };
        fetchSemesters();
    }, [type, setValue]);

    useEffect(() => {
        if (!semesterId) return;
        const fetchTeacherSubjects = async () => {
            try {
                const res = await getSubjectsForLesson(semesterId);
                setTeacherSubjects(res.data);
                setTeacherSubjectsLoaded(true);
            } catch {
                toast.error("Không thể tải danh sách giảng viên - học phần.");
            }
        };
        fetchTeacherSubjects();
    }, [semesterId]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await getRooms();
                setRooms(res.data);
            } catch {
                toast.error("Không thể tải danh sách phòng học.");
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        if (data && teacherSubjectsLoaded) {
            reset({
                semester_id: data.semester_id,
                start_date: data.start_date,
                end_date: data.end_date,
                day_of_week: data.day_of_week,
                start_time: data.start_time,
                end_time: data.end_time,
                room_id: data.room_id,
                is_active: Number(data.is_active),
                teacher_subject_id: data.teacher_subject_id,
            });
        }
    }, [data, reset, teacherSubjectsLoaded]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            const res =
                type === "create"
                    ? await addLesson(buildFormData(formData))
                    : await updateLesson(data?.id!, buildFormData(formData));

            toast.success(res.data.message || "Lưu thành công");
            onSubmitSuccess?.(res.data.data);
            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            toast.error("Đã xảy ra lỗi", {
                description: axiosErr.response?.data?.message || "Vui lòng kiểm tra lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm buổi học" : "Cập nhật buổi học"}
            </h2>

            <form className="md:grid grid-cols-3 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <SelectField
                    id="semester_id"
                    label="Chọn học kỳ"
                    options={semesters.map((s) => ({
                        value: s.id,
                        label: s.name,
                    }))}
                    register={register("semester_id", { valueAsNumber: true })}
                    error={errors.semester_id}
                />

                {teacherSubjectsLoaded && (
                    <SearchableSelectField
                        id="teacher_subject_id"
                        label="GV - Học phần"
                        control={control}
                        name="teacher_subject_id"
                        options={teacherSubjects.map((ts) => ({
                            label: `${ts.teacher.user.last_name} ${ts.teacher.user.first_name} - ${ts.subject.name}`,
                            value: ts.id,
                        }))}
                        error={errors.teacher_subject_id}
                    />
                )}

                <SelectField
                    id="day_of_week"
                    label="Thứ"
                    options={[
                        { label: "Chủ nhật", value: 7 },
                        { label: "Thứ 2", value: 1 },
                        { label: "Thứ 3", value: 2 },
                        { label: "Thứ 4", value: 3 },
                        { label: "Thứ 5", value: 4 },
                        { label: "Thứ 6", value: 5 },
                        { label: "Thứ 7", value: 6 },
                    ]}
                    register={register("day_of_week", { valueAsNumber: true })}
                    error={errors.day_of_week}
                />

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

                <SelectField
                    id="room_id"
                    label="Phòng học"
                    options={rooms.map((r) => ({
                        label: r.name,
                        value: r.id,
                    }))}
                    register={register("room_id", { valueAsNumber: true })}
                    error={errors.room_id}
                />

                <InputField
                    id="start_time"
                    label="Giờ bắt đầu"
                    type="time"
                    register={register("start_time")}
                    error={errors.start_time}
                />

                <InputField
                    id="end_time"
                    label="Giờ kết thúc"
                    type="time"
                    register={register("end_time")}
                    error={errors.end_time}
                />

                <SelectField
                    id="is_active"
                    label="Trạng thái"
                    options={[
                        { label: "Hoạt động", value: 1 },
                        { label: "Không hoạt động", value: 0 },
                    ]}
                    register={register("is_active", { valueAsNumber: true })}
                    error={errors.is_active}
                />

                <div className="col-span-2 mt-4">
                    <button
                        type="submit"
                        className={cn(
                            "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
                            { "opacity-50 pointer-events-none": loading }
                        )}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : type === "create" ? "Tạo mới" : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
};
