"use client";

import { z } from "zod";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import InputField from "../input-field";
import SelectField from "../select-field";
import FileUploader from "../FileUploader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { ModalType } from "./FormModal";
import { AnnouncementData } from "@/types/AnnouncementType";
import { addAnnouncement, updateAnnouncement } from "@/services/Announcement";
import CheckboxGroupField from "../checkbox-group-field";
import { getclasses } from "@/services/Classed";
import TextareaField from "../textarea-field";

const allowedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
];

const announcementSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    content: z.string().min(1, "Nội dung là bắt buộc"),
    date: z.string().min(1, "Ngày thông báo là bắt buộc"),
    target_type: z.enum(["all", "students", "teachers", "custom"], {
        required_error: "Vui lòng chọn đối tượng",
    }),
    target_classes: z.array(z.coerce.number().int()).optional(),
    file: z
        .instanceof(File)
        .refine((file) => allowedFileTypes.includes(file.type), {
            message: "Tệp không hợp lệ. Chỉ chấp nhận PDF, DOCX, PPT, PPTX.",
        })
        .optional(),
});

type FormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
    type: ModalType;
    data?: AnnouncementData;
    onSubmitSuccess?: (announcement: AnnouncementData) => void;
}

export const AnnouncementForm = ({
    type,
    data,
    onSubmitSuccess,
}: AnnouncementFormProps) => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
        watch,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            id: data?.id,
            title: data?.title ?? "",
            content: data?.content ?? "",
            date: data?.date ?? "",
            target_type: data?.target_type ?? "all",
            target_classes: data?.classes?.map((cls) => cls.id) ?? [],
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                id: data.id,
                title: data.title,
                content: data.content,
                date: data.date,
                target_type: data.target_type,
                target_classes: data.classes?.map((cls) => cls.id) ?? [],
            });
        }
    }, [data, reset]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getclasses();
                setClasses(res.data || []);
            } catch (err) {
                toast.error("Không thể tải danh sách lớp");
            }
        };
        fetchClasses();
    }, []);

    const buildFormData = (fd: FormData) => {
        const form = new FormData();
        if (fd.id) form.append("id", fd.id.toString());
        form.append("title", fd.title);
        form.append("content", fd.content);
        form.append("date", fd.date);
        form.append("target_type", fd.target_type);
        fd.target_classes?.forEach((id) => form.append("target_classes[]", String(id)));
        if (fd.file) {
            form.append("file_path", fd.file);
        }
        return form;
    };

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addAnnouncement(buildFormData(formData));
                toast.success("Tạo thông báo thành công");
            } else {
                res = await updateAnnouncement(formData.id!, buildFormData(formData));
                toast.success("Cập nhật thông báo thành công");
            }
            onSubmitSuccess?.(res.data.data);
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            if (axiosErr.response?.status === 422) {
                console.error("Validation errors:", axiosErr.response.data);
                const backendErrors = axiosErr.response.data.errors;
                Object.entries(backendErrors).forEach(([field, msgs]) => {
                    setError(field as keyof FormData, {
                        type: "server",
                        message: (msgs as string[])[0],
                    });
                });
            }
            toast.error("Lỗi khi gửi thông báo");
        } finally {
            setLoading(false);
        }
    };

    const targetType = watch("target_type");

    return (
        <form className="md:grid grid-cols-3 gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
                id="title"
                label="Tiêu đề"
                type="text"
                register={register("title")}
                error={errors.title}
            />
            <InputField
                id="date"
                label="Ngày thông báo"
                type="date"
                register={register("date")}
                error={errors.date}
            />
            <SelectField
                id="target_type"
                label="Đối tượng"
                register={register("target_type")}
                error={errors.target_type}
                options={[
                    { label: "Tất cả", value: "all" },
                    { label: "Sinh viên", value: "students" },
                    { label: "Giảng viên", value: "teachers" },
                    { label: "Tùy chọn lớp", value: "custom" },
                ]}
            />

            <div className="col-span-3">
                <TextareaField
                    id="content"
                    label="Nội dung"
                    register={register("content")}
                    error={errors.content}
                />
            </div>

            {targetType === "custom" && (
                <div className="col-span-3">
                    <CheckboxGroupField
                        id="target_classes"
                        name="target_classes"
                        label="Lớp áp dụng"
                        control={control}
                        options={classes.map((cls) => ({
                            label: cls.name,
                            value: cls.id,
                        }))}
                        error={errors.target_classes as FieldError}
                    />
                </div>
            )}

            <div className="col-span-3">
                <FileUploader
                    name="file"
                    control={control}
                    error={errors.file}
                    defaultFilename={data?.file_path}
                />
            </div>

            <div className="col-span-3">
                <button
                    type="submit"
                    className={cn(
                        "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
                        {
                            "opacity-50 pointer-events-none": loading,
                        }
                    )}
                    disabled={loading}
                >
                    {loading
                        ? "Đang xử lý..."
                        : type === "create"
                            ? "Tạo thông báo"
                            : "Cập nhật thông báo"}
                </button>
            </div>
        </form>
    );
};
