"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../input-field";
import SelectField from "../select-field";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ModalType } from "./FormModal";
import { getExamSchedules } from "@/services/ExamSchedule";
import { getRooms } from "@/services/Room";
import { AxiosError } from "axios";
import { z } from "zod";
import { getclasses } from "@/services/Classed";
import { addExamRoom, updateExamRoom } from "@/services/ExamRoom";
import { ExamSchedule } from "@/types/ExamType";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const examRoomSchema = z
    .object({
        id: z.coerce.number().optional(),
        exam_schedule_id: z.coerce.number({ required_error: "Vui lòng chọn lịch thi" }),
        room_id: z.coerce.number({ required_error: "Vui lòng chọn phòng thi" }),
        class_id: z.coerce.number({ required_error: "Vui lòng chọn lớp thi" }),
        start_seat: z.coerce.number().min(1, "Stt bắt đầu phải >= 1"),
        end_seat: z.coerce.number().min(1, "Stt kết thúc phải >= 1"),
    })
    .superRefine((data, ctx) => {
        if (data.end_seat < data.start_seat) {
            ctx.addIssue({
                code: "custom",
                path: ["end_seat"],
                message: "Stt kết thúc phải >= stt bắt đầu",
            });
        }
    });

type ExamRoomFormValues = z.infer<typeof examRoomSchema>;

interface ExamRoomFormProps {
    type: ModalType;
    data?: ExamRoomFormValues;
    onSubmitSuccess?: (data: any) => void;
}

export const ExamRoomForm = ({ type, data, onSubmitSuccess }: ExamRoomFormProps) => {
    const [loading, setLoading] = useState(false);
    const [examSchedules, setExamSchedules] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<ExamRoomFormValues>({
        resolver: zodResolver(examRoomSchema),
        defaultValues: {
            id: data?.id,
            exam_schedule_id: data?.exam_schedule_id ?? Number(examSchedules[0]?.id) | 1,
            room_id: data?.room_id ?? rooms[0]?.id | 1,
            class_id: data?.class_id ?? classes[0]?.id | 1,
            start_seat: data?.start_seat ?? 1,
            end_seat: data?.end_seat ?? 30,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schedules, roomList, classList] = await Promise.all([
                    getExamSchedules(),
                    getRooms(),
                    getclasses(),
                ]);
                setExamSchedules(schedules || []);
                setRooms(roomList.data || []);
                setClasses(classList.data || []);
            } catch (err) {
                toast.error("Lỗi khi tải dữ liệu", {
                    description: "Vui lòng kiểm tra kết nối.",
                });
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            reset({
                id: data.id,
                exam_schedule_id: data.exam_schedule_id,
                room_id: data.room_id,
                class_id: data.class_id,
                start_seat: data.start_seat,
                end_seat: data.end_seat,
            });
        }
    }, [data, reset]);

    const buildFormData = (data: ExamRoomFormValues): FormData => {
        const form = new FormData();
        if (data.id) form.append("id", data.id.toString());
        form.append("exam_schedule_id", data.exam_schedule_id.toString());
        form.append("room_id", data.room_id.toString());
        form.append("class_id", data.class_id.toString());
        form.append("start_seat", data.start_seat.toString());
        form.append("end_seat", data.end_seat.toString());
        return form;
    };

    const onSubmit: SubmitHandler<ExamRoomFormValues> = async (formData) => {
        setLoading(true);
        try {
            const data = buildFormData(formData);
            let res;
            if (type === "create") {
                res = await addExamRoom(data);
                toast.success(res.data.message || "Thêm phân công thành công");
            } else {
                res = await updateExamRoom(formData.id!, data);
                toast.success(res.data.message || "Cập nhật phân công thành công");
            }
            onSubmitSuccess?.(res.data.data);
            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
                Object.entries(axiosErr.response.data.errors).forEach(([field, msgs]) => {
                    setError(field as keyof ExamRoomFormValues, {
                        type: "server",
                        message: (msgs as string[])[0],
                    });
                });
            }
            toast.error("Có lỗi xảy ra", {
                description: axiosErr.response?.data?.message || "Vui lòng thử lại",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 p-4">
            {!loading && <>

                <SelectField
                    id="exam_schedule_id"
                    label="Lịch thi"
                    options={examSchedules.map((s: ExamSchedule) => ({
                        label: `${s.semester_subject.subject.name} - ${format(new Date(s.exam_date), "dd/MM/yyyy", { locale: vi })} - ${s.exam_time.slice(0, 5)}`,
                        value: s.id,
                    }))}
                    register={register("exam_schedule_id", { valueAsNumber: true })}
                    error={errors.exam_schedule_id}
                />

                <SelectField
                    id="room_id"
                    label="Phòng thi"
                    options={rooms.map((r) => ({ label: r.name, value: r.id }))}
                    register={register("room_id", { valueAsNumber: true })}
                    error={errors.room_id}
                />

                <SelectField
                    id="class_id"
                    label="Lớp thi"
                    options={classes.map((c) => ({ label: c.name, value: c.id }))}
                    register={register("class_id", { valueAsNumber: true })}
                    error={errors.class_id}
                />

                <InputField
                    id="start_seat"
                    label="Stt bắt đầu"
                    type="number"
                    register={register("start_seat", { valueAsNumber: true })}
                    error={errors.start_seat}
                />

                <InputField
                    id="end_seat"
                    label="Stt kết thúc"
                    type="number"
                    register={register("end_seat", { valueAsNumber: true })}
                    error={errors.end_seat}
                />

                <div className="col-span-2 mt-4">
                    <button
                        type="submit"
                        className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${loading ? "opacity-50 pointer-events-none" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : type === "create" ? "Tạo mới" : "Cập nhật"}
                    </button>
                </div>
            </>}
        </form>
    );
};
