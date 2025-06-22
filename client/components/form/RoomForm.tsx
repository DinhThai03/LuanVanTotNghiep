"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { RoomData } from "@/types/RoomType";
import { addRoom, updateRoom } from "@/services/Room";
import SelectField from "../select-field";

const roomSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Tên phòng không được để trống"),
    size: z.coerce.number().min(10, "Sức chứa phải lớn hơn 10"),
    room_type: z.string().min(1, "Loại phòng không được để trống"),
    is_active: z.boolean(),
});

type FormData = z.infer<typeof roomSchema>;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("name", fd.name);
    form.append("size", String(fd.size));
    form.append("room_type", fd.room_type);
    form.append("is_active", fd.is_active ? "1" : "0");
    return form;
};

interface RoomFormProps {
    type: ModalType;
    data?: RoomData;
    onSubmitSuccess?: (room: RoomData) => void;
}

export const RoomForm = ({ type, data, onSubmitSuccess }: RoomFormProps) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name ?? "",
            size: data?.size ?? 10,
            room_type: data?.room_type ?? "LT",
            is_active: data?.is_active === 1,
        },
    });

    // Đồng bộ khi mở form update
    useEffect(() => {
        if (data) {
            reset({
                id: data.id,
                name: data.name,
                size: data.size,
                room_type: data.room_type,
                is_active: data.is_active === 1,
            });
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addRoom(buildFormData(formData));
                toast.success(res.data.message || "Thêm phòng thành công");
            } else {
                res = await updateRoom(formData.id!, buildFormData(formData));
                toast.success(res.data.message || "Cập nhật phòng thành công");
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

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm phòng" : "Cập nhật phòng"}
            </h2>

            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <InputField
                    id="name"
                    label="Tên phòng"
                    type="text"
                    register={register("name")}
                    error={errors.name}
                />

                <InputField
                    id="size"
                    label="Sức chứa"
                    type="number"
                    register={register("size", { valueAsNumber: true })}
                    error={errors.size}
                />


                <SelectField
                    id="room_type"
                    label="Loại phòng"
                    options={[
                        { label: "Lý thuyết", value: "LT" },
                        { label: "Thực hành", value: "TH" },
                    ]}
                    register={register("room_type")}
                    error={errors.room_type}
                />

                <SelectField
                    id="is_active"
                    label="Trạng thái"
                    options={[
                        { label: "Hoạt động", value: true },
                        { label: "Ngưng hoạt động", value: false },
                    ]}
                    register={register("is_active")}
                    error={errors.is_active}
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
                                ? "Tạo mới"
                                : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
};
