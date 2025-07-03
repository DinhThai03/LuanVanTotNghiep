"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import InputField from "../input-field";
import { cn } from "@/lib/utils";
import { GradeData } from "@/types/GradeType";
import { ModalType } from "./FormModal";
import { updateGrade } from "@/services/Grade";

// Giữ nguyên schema validation như cũ
const schema = z.object({
    process_score: z
        .union([
            z.string().length(0), // Cho phép empty string
            z.coerce.number({ invalid_type_error: "Điểm quá trình phải là số" })
                .min(0, { message: "Điểm quá trình phải >= 0" })
                .max(10, { message: "Điểm quá trình phải <= 10" })
        ]),
    midterm_score: z
        .union([
            z.string().length(0),
            z.coerce.number({ invalid_type_error: "Điểm giữa kỳ phải là số" })
                .min(0, { message: "Điểm giữa kỳ phải >= 0" })
                .max(10, { message: "Điểm giữa kỳ phải <= 10" })
        ]),
    final_score: z
        .union([
            z.string().length(0),
            z.coerce.number({ invalid_type_error: "Điểm cuối kỳ phải là số" })
                .min(0, { message: "Điểm cuối kỳ phải >= 0" })
                .max(10, { message: "Điểm cuối kỳ phải <= 10" })
        ]),
});

type FormData = z.infer<typeof schema>;

interface GradeFormProps {
    data: GradeData;
    onSubmitSuccess?: (grade: GradeData) => void;
}

export const GradeForm = ({ data, onSubmitSuccess }: GradeFormProps) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            process_score: data.process_score?.toString() ?? "",
            midterm_score: data.midterm_score?.toString() ?? "",
            final_score: data.final_score?.toString() ?? "",
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            // Tạo FormData và thêm các trường vào
            const form = new FormData();

            // Thêm các trường điểm, chuyển empty string thành null
            if (formData.process_score !== "") {
                form.append("process_score", formData.process_score.toString());
            } else {
                form.append("process_score", ""); // Gửi empty string để server xử lý thành null
            }

            if (formData.midterm_score !== "") {
                form.append("midterm_score", formData.midterm_score.toString());
            } else {
                form.append("midterm_score", "");
            }

            if (formData.final_score !== "") {
                form.append("final_score", formData.final_score.toString());
            } else {
                form.append("final_score", "");
            }

            const res = await updateGrade(data.registration_id, form);
            toast.success("Cập nhật điểm thành công");
            onSubmitSuccess?.(res.data.data);
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            console.error("Chi tiết lỗi:", axiosErr.response?.data);

            if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
                const backendErrors = axiosErr.response.data.errors;
                Object.entries(backendErrors).forEach(([field, msgs]) => {
                    setError(field as keyof FormData, {
                        type: "server",
                        message: (msgs as string[])[0],
                    });
                });
            }

            toast.error("Đã xảy ra lỗi khi cập nhật điểm", {
                description: axiosErr.response?.data?.message || "Vui lòng thử lại sau",
            });
        } finally {
            setLoading(false);
        }
    };

    const student = data.registration.student;
    const subject = data.registration.lesson.teacher_subject.subject;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Cập nhật điểm</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div><strong>Mã SV:</strong> {student.code}</div>
                <div><strong>Tên SV:</strong> {student.user.last_name + " " + student.user.first_name}</div>
                <div><strong>Mã môn:</strong> {subject.code}</div>
                <div><strong>Tên môn:</strong> {subject.name}</div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-3 gap-4">
                    <InputField
                        id="process_score"
                        label="Điểm quá trình"
                        type="number"
                        register={register("process_score")}
                        step={0.01}
                        min={0}
                        max={10}
                        error={errors.process_score}
                    />
                    <InputField
                        id="midterm_score"
                        label="Điểm giữa kỳ"
                        type="number"
                        register={register("midterm_score")}
                        step={0.01}
                        min={0}
                        max={10}
                        error={errors.midterm_score}
                    />
                    <InputField
                        id="final_score"
                        label="Điểm cuối kỳ"
                        type="number"
                        register={register("final_score")}
                        step={0.01}
                        min={0}
                        max={10}
                        error={errors.final_score}
                    />
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className={cn(
                            "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
                            { "opacity-50 pointer-events-none": loading }
                        )}
                    >
                        {loading ? "Đang xử lý..." : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
};