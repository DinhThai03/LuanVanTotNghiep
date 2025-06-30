"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import InputField from "../input-field";
import SelectField from "../select-field";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

import { addParent, updateParent } from "@/services/Parents";
import { ParentData } from "@/types/ParentType";

const binaryEnum = z.union([z.literal(0), z.literal(1)]);

const parentSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    last_name: z.string().min(1, "Họ không được để trống"),
    first_name: z.string().min(1, "Tên không được để trống"),
    sex: binaryEnum,
    date_of_birth: z.string().min(1, "Vui lòng nhập ngày sinh").refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ"),
    address: z.string().min(5, "Địa chỉ không được để trống"),
    phone: z.string().min(10).max(11).regex(/^\d+$/, "Chỉ chứa số"),
    identity_number: z.string().regex(/^[0-9]{9}$|^[0-9]{12}$/, "CCCD phải gồm 9 hoặc 12 số"),
    issued_date: z.string().min(1, "Ngày cấp không được để trống"),
    issued_place: z.string().min(1, "Nơi cấp không được để trống"),
    ethnicity: z.string().min(1, "Dân tộc không được để trống"),
    religion: z.string().min(1, "Tôn giáo không được để trống"),
});

type FormData = z.infer<typeof parentSchema>;

interface ParentFormProps {
    type: ModalType;
    data?: ParentData;
    onSubmitSuccess?: (parent: ParentData) => void;
}

const buildFormData = (fd: FormData, userId?: number) => {
    const form = new FormData();

    form.append("email", fd.email);
    form.append("last_name", fd.last_name);
    form.append("first_name", fd.first_name);
    form.append("sex", String(fd.sex));
    form.append("date_of_birth", fd.date_of_birth);
    form.append("address", fd.address);
    form.append("phone", fd.phone);
    form.append("identity_number", fd.identity_number);
    form.append("issued_date", fd.issued_date);
    form.append("issued_place", fd.issued_place);
    form.append("ethnicity", fd.ethnicity);
    form.append("religion", fd.religion);

    if (userId) {
        form.append("user_id", String(userId));
    }

    return form;
};


export const ParentForm = ({ type, data, onSubmitSuccess }: ParentFormProps) => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(parentSchema),
        defaultValues: {
            email: "",
            last_name: "",
            first_name: "",
            sex: 1,
            date_of_birth: "",
            address: "",
            phone: "",
            identity_number: "",
            issued_date: "",
            issued_place: "",
            ethnicity: "",
            religion: "",
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                email: data.user.email,
                last_name: data.user.last_name,
                first_name: data.user.first_name,
                sex: data.user.sex ? 1 : 0,
                date_of_birth: data.user.date_of_birth.split("T")[0],
                address: data.user.address,
                phone: data.user.phone,
                identity_number: data.user.identity_number,
                issued_date: data.user.issued_date.split("T")[0],
                issued_place: data.user.issued_place,
                ethnicity: data.user.ethnicity,
                religion: data.user.religion,
            });
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            const form = buildFormData(formData, data?.student?.user_id);

            const res = type === "create"
                ? await addParent(form)
                : await updateParent(data?.user_id!, form);

            toast.success(
                type === "create"
                    ? "Thêm phụ huynh thành công!"
                    : "Cập nhật phụ huynh thành công!"
            );

            onSubmitSuccess?.(res.data.data);

            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
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
                description: "Vui lòng kiểm tra lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm phụ huynh" : "Cập nhật phụ huynh"}
            </h2>

            <form
                className="md:grid grid-cols-3 gap-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <InputField id="last_name" label="Họ" register={register("last_name")} error={errors.last_name} />
                <InputField id="first_name" label="Tên" register={register("first_name")} error={errors.first_name} />
                <InputField id="email" label="Email" register={register("email")} error={errors.email} />
                <InputField id="date_of_birth" label="Ngày sinh" type="date" register={register("date_of_birth")} error={errors.date_of_birth} />
                <SelectField id="sex" label="Giới tính" options={[{ label: "Nam", value: 1 }, { label: "Nữ", value: 0 }]} register={register("sex", { valueAsNumber: true })} error={errors.sex} />
                <InputField id="address" label="Địa chỉ" register={register("address")} error={errors.address} />
                <InputField id="phone" label="Số điện thoại" register={register("phone")} error={errors.phone} />
                <InputField id="identity_number" label="CCCD" register={register("identity_number")} error={errors.identity_number} />
                <InputField id="issued_date" label="Ngày cấp" type="date" register={register("issued_date")} error={errors.issued_date} />
                <InputField id="issued_place" label="Nơi cấp" register={register("issued_place")} error={errors.issued_place} />
                <InputField id="ethnicity" label="Dân tộc" register={register("ethnicity")} error={errors.ethnicity} />
                <InputField id="religion" label="Tôn giáo" register={register("religion")} error={errors.religion} />

                <div className="mt-4 col-span-3">
                    <button
                        type="submit"
                        className={cn("bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700", {
                            "opacity-50 pointer-events-none": loading,
                        })}
                    >
                        {loading ? "Đang xử lý..." : type === "create" ? "Tạo mới" : "Cập nhật"}
                    </button>
                </div>
            </form>
        </div>
    );
};
