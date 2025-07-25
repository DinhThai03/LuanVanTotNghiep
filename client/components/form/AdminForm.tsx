"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AdminData } from "@/types/AdminType";
import { ModalType } from "./FormModal";
import { addAdmin, updateAdmin } from "@/services/Admins";
import { AxiosError } from "axios";
import InputField from "../input-field";
import PasswordField from "../password-field";
import SelectField from "../select-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const binaryEnum = z.union([z.literal(0), z.literal(1)]);

const baseSchema = z.object({
    id: z.number().optional(),
    last_name: z.string().min(1, "Họ không được để trống"),
    first_name: z.string().min(1, "Tên không được để trống"),
    sex: binaryEnum,
    email: z.string().email("Email không hợp lệ"),
    date_of_birth: z
        .string()
        .min(1, "Vui lòng nhập ngày sinh")
        .refine(
            (val) => !isNaN(Date.parse(val)),
            "Ngày sinh không hợp lệ"
        )
        .refine((val) => {
            const year = new Date(val).getFullYear();
            const currentYear = new Date().getFullYear();
            return currentYear - year >= 18;
        }, "Người dùng phải từ 18 tuổi trở lên"),
    address: z.string().min(5, "Vui lòng nhập địa chỉ"),
    phone: z
        .string()
        .min(10, "Số điện thoại phải tối thiểu 10 số")
        .max(11, "Số điện thoại tối đa 11 số")
        .regex(/^\d+$/, "Số điện thoại chỉ gồm chữ số"),

    identity_number: z
        .string()
        .nonempty("Số CCCD/CMND không được để trống")
        .regex(/^[0-9]{9}$|^[0-9]{12}$/, "Số CCCD/CMND phải gồm 9 hoặc 12 chữ số"),


    issued_date: z
        .string()
        .min(1, "ngày cấp không hợp lệ"),

    issued_place: z.string().min(1, "Nơi cấp không được để trống"),

    ethnicity: z.string().min(1, "Dân tộc không được để trống"),

    religion: z.string().min(1, "Tôn giáo không được để trống"),
    is_active: binaryEnum,
    admin_level: z
        .coerce.number({ invalid_type_error: "Cấp quản trị là số" })
        .min(1, "Cấp quản trị phải từ 1 đến 3")
        .max(3, "Cấp quản trị phải từ 1 đến 3"),
});

const createSchema = baseSchema.extend({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

const updateSchema = baseSchema.extend({
    username: z.string().optional(),
    password: z.string().optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;
type FormData = CreateFormData | UpdateFormData;

const buildFormData = (fd: FormData, type: ModalType) => {
    const form = new FormData();

    form.append("email", fd.email);
    form.append("last_name", fd.last_name);
    form.append("first_name", fd.first_name);
    form.append("role", "admin");
    form.append("sex", fd.sex.toString());
    form.append("date_of_birth", fd.date_of_birth);
    form.append("address", fd.address);
    form.append("phone", fd.phone);
    form.append("is_active", fd.is_active.toString());
    form.append("admin_level", fd.admin_level.toString());
    form.append("identity_number", fd.identity_number || "");
    form.append("issued_date", fd.issued_date || "");
    form.append("issued_place", fd.issued_place || "");
    form.append("ethnicity", fd.ethnicity || "");
    form.append("religion", fd.religion || "");

    if (type === "create") {
        const cfd = fd as CreateFormData;
        form.append("username", cfd.username);
        form.append("password", cfd.password);
    }
    if (type === "update") {
        form.append("user_id", fd.id?.toString()!);
    }
    return form;
};

interface AdminFormProps {
    type: ModalType;
    data?: AdminData;
    onSubmitSuccess?: (admin: AdminData) => void;
}

export const AdminForm = ({
    type,
    data,
    onSubmitSuccess,
}: AdminFormProps) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(type === "create" ? createSchema : updateSchema),
        defaultValues: {
            id: data?.user.id,
            username: data?.user.username ?? "",
            last_name: data?.user.last_name ?? "",
            first_name: data?.user.first_name ?? "",
            email: data?.user.email ?? "",
            date_of_birth: data ? new Date(data.user.date_of_birth).toISOString().split("T")[0] : "",
            address: data?.user.address ?? "",
            phone: data?.user.phone ?? "",
            sex: data ? (data.user.sex ? 1 : 0) : 1,
            is_active: data ? (data.user.is_active ? 1 : 0) : 1,
            admin_level: data?.admin_level ?? 1,
            password: type === "create" ? "" : undefined,

            identity_number: data?.user.identity_number ?? "",
            issued_date: data?.user.issued_date ? new Date(data.user.issued_date).toISOString().split("T")[0] : "",
            issued_place: data?.user.issued_place ?? "",
            ethnicity: data?.user.ethnicity ?? "",
            religion: data?.user.religion ?? "",
        }

    });

    watch(["sex", "is_active", "admin_level"]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);

        try {
            if (type === "create") {
                const res = await addAdmin(buildFormData(formData, "create"));
                const message = res.data.message || "Thêm quản trị viên thành công.";
                toast.success(message);
                reset();
                onSubmitSuccess?.(res.data.admin);
            } else {
                if (!formData.id) throw new Error("Thiếu ID người dùng khi cập nhật");
                const res = await updateAdmin(formData.id, buildFormData(formData, "update"));
                const message = res.data.message || "Cập nhật thành công.";
                toast.success(message);
                onSubmitSuccess?.(res.data.admin);
            }
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            let message;
            console.error("Chi tiết lỗi server:", axiosErr.response?.data);

            // Nếu backend trả về validation dạng { field: ["msg"] }
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
                message = (axiosErr.response.data.message);
            } else if (axiosErr.response?.data?.error) {
                message = (axiosErr.response.data.error);
            }
            else if (axiosErr.message === "Network Error") {
                message = ("Không thể kết nối đến server.");
            } else {
                message = ("Đã có lỗi xảy ra.");
            }
            toast.error(message, {
                description: "vui lòng kiểm tra lại",
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm mới quản trị viên" : "Cập nhật quản trị viên"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-3 gap-x-4 gap-y-2">
                    {type === "create" && (
                        <>
                            <InputField
                                id="username"
                                label="Tên đăng nhập"
                                type="text"
                                register={register("username")}
                                error={errors.username}
                            />
                            <PasswordField
                                id="password"
                                register={register("password")}
                                error={errors.password}
                            />
                        </>
                    )}

                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        register={register("email")}
                        error={errors.email}
                    />

                    <InputField
                        id="last_name"
                        label="Họ"
                        type="text"
                        register={register("last_name")}
                        error={errors.last_name}
                    />

                    <InputField
                        id="first_name"
                        label="Tên"
                        type="text"
                        register={register("first_name")}
                        error={errors.first_name}
                    />

                    <InputField
                        id="date_of_birth"
                        label="Ngày sinh"
                        type="date"
                        register={register("date_of_birth")}
                        error={errors.date_of_birth}
                    />

                    <SelectField
                        id="sex"
                        label="Giới tính"
                        options={[
                            { label: "Nam", value: 1 },
                            { label: "Nữ", value: 0 },
                        ]}
                        register={register("sex", { valueAsNumber: true })}
                        error={errors.sex}
                    />

                    <InputField
                        id="address"
                        label="Địa chỉ"
                        type="text"
                        register={register("address")}
                        error={errors.address}
                    />

                    <InputField
                        id="phone"
                        label="Số điện thoại"
                        type="text"
                        register={register("phone")}
                        error={errors.phone}
                    />

                    <InputField
                        id="identity_number"
                        label="Số CMND/CCCD"
                        type="text"
                        register={register("identity_number")}
                        error={errors.identity_number}
                    />

                    <InputField
                        id="issued_date"
                        label="Ngày cấp"
                        type="date"
                        register={register("issued_date")}
                        error={errors.issued_date}
                    />

                    <InputField
                        id="issued_place"
                        label="Nơi cấp"
                        type="text"
                        register={register("issued_place")}
                        error={errors.issued_place}
                    />

                    <InputField
                        id="ethnicity"
                        label="Dân tộc"
                        type="text"
                        register={register("ethnicity")}
                        error={errors.ethnicity}
                    />

                    <InputField
                        id="religion"
                        label="Tôn giáo"
                        type="text"
                        register={register("religion")}
                        error={errors.religion}
                    />


                    <SelectField
                        id="is_active"
                        label="Trạng thái"
                        options={[
                            { label: "Hoạt động", value: 1 },
                            { label: "Vô hiệu hóa", value: 0 },
                        ]}
                        register={register("is_active", { valueAsNumber: true })}
                        error={errors.is_active}
                    />

                    {/* <SelectField
                        id="admin_level"
                        label="Cấp quản trị"
                        options={[
                            { label: "1 - Super admin", value: 1 },
                            { label: "2 - admin", value: 2 },
                        ]}
                        register={register("admin_level", { valueAsNumber: true })}
                        error={errors.admin_level}
                    /> */}
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className={cn(
                            "bg-green-500 text-white px-4 py-2 rounded transition",
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
