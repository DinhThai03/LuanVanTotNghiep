"use client";

import { z } from "zod";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import { AxiosError } from "axios";
import InputField from "../input-field";
import PasswordField from "../password-field";
import SelectField from "../select-field";
import CheckboxGroupField from "../checkbox-group-field";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TeacherData } from "@/types/TeacherType";
import { addTeacher, updateTeacher } from "@/services/Teacher";
import { getFacultys } from "@/services/Faculty";
import { FacultyData } from "@/types/FacultyType";
import { SubjectData } from "@/types/SubjectType";
import { getSubjectsByFaculty } from "@/services/Subject";
import { useRouter } from "next/navigation";
import { el } from "date-fns/locale";

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
        .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ")
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
    issued_date: z.string().min(1, "Ngày cấp không hợp lệ"),
    issued_place: z.string().min(1, "Nơi cấp không được để trống"),
    ethnicity: z.string().min(1, "Dân tộc không được để trống"),
    religion: z.string().min(1, "Tôn giáo không được để trống"),
    faculty_id: z.coerce.number().min(0, "Vui lòng chọn khoa"),
    status: z
        .enum(['Probation', 'Official', 'Resigned'], {
            errorMap: () => ({ message: "Vui lòng chọn trạng thái" }),
        }),
    is_active: binaryEnum,
    subject_ids: z.array(z.coerce.number()).min(1, "Vui lòng chọn môn học"),
});

const createSchema = baseSchema.extend({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    code: z.string().length(10, "Mã giảng viên phải đúng 10 ký tự"),
});

const updateSchema = baseSchema.extend({
    username: z.string().optional(),
    password: z.string().optional(),
    code: z.string().optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;
type FormData = CreateFormData | UpdateFormData;

const buildFormData = (fd: FormData, type: ModalType) => {
    const form = new FormData();
    form.append("email", fd.email);
    form.append("last_name", fd.last_name);
    form.append("first_name", fd.first_name);
    form.append("role", "teacher");
    form.append("sex", fd.sex.toString());
    form.append("date_of_birth", fd.date_of_birth);
    form.append("address", fd.address);
    form.append("phone", fd.phone);
    form.append("identity_number", fd.identity_number || "");
    form.append("issued_date", fd.issued_date || "");
    form.append("issued_place", fd.issued_place || "");
    form.append("ethnicity", fd.ethnicity || "");
    form.append("religion", fd.religion || "");
    form.append("faculty_id", fd.faculty_id.toString());
    form.append("status", fd.status);
    form.append("is_active", fd.is_active.toString());
    fd.subject_ids.forEach((id) => form.append("subject_ids[]", id.toString()));

    if (type === "create") {
        const cfd = fd as CreateFormData;
        form.append("code", cfd.code);
        form.append("username", cfd.username);
        form.append("password", cfd.password);
    }

    if (type === "update") {
        form.append("user_id", fd.id?.toString()!);
    }

    return form;
};

interface TeacherFormProps {
    type: ModalType;
    data?: TeacherData;
    onSubmitSuccess?: (teacher: TeacherData) => void;
}

export const TeacherForm = ({ type, data, onSubmitSuccess }: TeacherFormProps) => {
    const route = useRouter();
    const [loading, setLoading] = useState(false);
    const [faculties, setFaculties] = useState<FacultyData[]>([]);
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const [facultiesLoaded, setFacultiesLoaded] = useState(false);


    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        control,
        reset,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(type === "create" ? createSchema : updateSchema),
        defaultValues: {
            id: data?.user.id,
            username: data?.user.username ?? "",
            code: data?.code ?? "",
            last_name: data?.user.last_name ?? "",
            first_name: data?.user.first_name ?? "",
            email: data?.user.email ?? "",
            date_of_birth: data
                ? new Date(data.user.date_of_birth).toISOString().split("T")[0]
                : "",
            address: data?.user.address ?? "",
            phone: data?.user.phone ?? "",
            sex: data ? (data.user.sex ? 1 : 0) : 1,
            is_active: data ? (data.user.is_active ? 1 : 0) : 1,
            password: type === "create" ? "" : undefined,
            identity_number: data?.user.identity_number ?? "",
            issued_date: data?.user.issued_date
                ? new Date(data.user.issued_date).toISOString().split("T")[0]
                : "",
            issued_place: data?.user.issued_place ?? "",
            ethnicity: data?.user.ethnicity ?? "",
            religion: data?.user.religion ?? "",
            faculty_id: data?.faculty_id ?? undefined,
            subject_ids: data?.teacher_subjects?.map((s) => s.subject_id) ?? [],
            status: (data?.status ?? "Probation") as 'Probation' | 'Official' | 'Resigned',
        },
    });

    const faculty_id = watch("faculty_id");

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                setLoading(true);
                const res = await getFacultys();
                if (res) {
                    if (res.length === 0) {
                        route.push("/admin/lists/facultys");
                        toast.error("Không có khoa nào được tìm thấy. Vui lòng tạo khoa trước.");
                        return;
                    }
                    setFaculties(res.data);
                }
                setFacultiesLoaded(true);
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                toast.error(axiosErr.response?.data?.message || "Lỗi khi lấy danh sách khoa");
            } finally {
                setLoading(false);
            }
            console.log(data);
        };
        fetchFaculties();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const res = await getSubjectsByFaculty(faculty_id);

                console.log(res);
                if (res) {
                    if (res.length === 0) {
                        route.push("/admin/lists/subjects");
                        toast.error("Không có môn học nào được tìm thấy cho khoa này. Vui lòng tạo môn học trước.");
                        return;
                    }
                    setSubjects(res);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                toast.error(axiosErr.response?.data?.message || "Lỗi khi lấy môn học");
            } finally {
                setLoading(false);
            }
        };
        if (faculty_id) fetchSubjects();
    }, [faculty_id]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            if (type === "create") {
                const res = await addTeacher(buildFormData(formData, "create"));
                toast.success(res.data.message || "Tạo mới thành công.");
                reset();
                onSubmitSuccess?.(res.data.data);
            } else {
                if (!formData.code) throw new Error("Thiếu mã giảng viên");
                const res = await updateTeacher(formData.code, buildFormData(formData, "update"));
                toast.success(res.data.message || "Cập nhật thành công.");
                onSubmitSuccess?.(res.data.data);
            }
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            if (axiosErr.response?.status === 422 && axiosErr.response.data.errors) {
                Object.entries(axiosErr.response.data.errors).forEach(([key, val]) => {
                    setError(key as keyof FormData, {
                        type: "server",
                        message: (val as string[])[0],
                    });
                });
            }
            toast.error(axiosErr.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {type === "create" ? "Thêm mới giảng viên" : "Cập nhật giảng viên"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="md:grid grid-cols-3 gap-x-4 gap-y-4">
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
                            <InputField
                                id="code"
                                label="Mã giảng viên"
                                type="text"
                                register={register("code")}
                                error={errors.code}
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
                    {facultiesLoaded ?
                        <SelectField
                            id="faculty_id"
                            label="Khoa"
                            options={faculties.map((f) => ({
                                label: f.name,
                                value: Number(f.id),
                            }))}
                            register={register("faculty_id", { valueAsNumber: true })}
                            error={errors.faculty_id}
                        />
                        : "Loading..."
                    }
                    <SelectField
                        id="status"
                        label="Trạng thái"
                        options={[
                            { label: "Thử việc", value: "Probation" },
                            { label: "Chính thức", value: "Official" },
                            { label: "Nghỉ việc", value: "Resigned" },
                        ]}
                        register={register("status")}
                        error={errors.status}
                    />
                    <SelectField
                        id="is_active"
                        label="Trạng thái hoạt động"
                        options={[
                            { label: "Hoạt động", value: 1 },
                            { label: "Vô hiệu hóa", value: 0 },
                        ]}
                        register={register("is_active", { valueAsNumber: true })}
                        error={errors.is_active}
                    />
                    <div className="col-span-3">
                        <CheckboxGroupField
                            id="subject_ids"
                            label="Môn học giảng dạy"
                            name="subject_ids"
                            control={control}
                            options={subjects.map((s) => ({
                                label: s.name,
                                value: s.id,
                            }))}
                            error={errors.subject_ids as FieldError}
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className={cn(
                            "bg-green-500 text-white px-4 py-2 rounded transition",
                            {
                                "opacity-50 pointer-events-none": loading,
                            }
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
