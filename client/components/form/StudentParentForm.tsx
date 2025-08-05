"use client";

import { date, z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ModalType } from "./FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";

import InputField from "../input-field";
import SelectField from "../select-field";
import SearchableSelectField from "../searchable-select-field";
import { cn } from "@/lib/utils";

import { ClassData } from "@/types/ClassType";
import { StudentData } from "@/types/StudentType";
import { getclasses } from "@/services/Classed";
import { getParentByStudentCode } from "@/services/Parents";
import { addStudent, updateStudent } from "@/services/Student";
import { useRouter } from "next/navigation";

const binaryEnum = z.union([z.literal(0), z.literal(1)]);

const baseUserSchema = z.object({
    last_name: z.string().min(1, "Họ không được để trống"),
    first_name: z.string().min(1, "Tên không được để trống"),
    sex: binaryEnum,
    email: z.string().email("Email không hợp lệ"),
    date_of_birth: z.string().min(1, "Vui lòng nhập ngày sinh")
        .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ"),
    address: z.string().min(5, "Địa chỉ không được để trống"),
    phone: z.string().min(10).max(11).regex(/^\d+$/, "Chỉ chứa số"),
    identity_number: z.string().regex(/^[0-9]{9}$|^[0-9]{12}$/, "Số CCCD/CMND phải gồm 9 hoặc 12 số"),
    issued_date: z.string().min(1, "Ngày cấp không được để trống"),
    issued_place: z.string().min(1, "Nơi cấp không được để trống"),
    ethnicity: z.string().min(1, "Dân tộc không được để trống"),
    religion: z.string().min(1, "Tôn giáo không được để trống"),
});

const studentSchema = baseUserSchema.extend({
    code: z.string().min(1, "Mã sinh viên không được để trống"),
    place_of_birth: z.string().min(1, "Nơi sinh không được để trống"),
    status: z.string().min(1, "Trạng thái không được để trống"),
    class_id: z.coerce.number().min(1, "Lớp không hợp lệ"),
});

const createSchema = z.object({
    student: studentSchema,
    parent: baseUserSchema,
});

const updateSchema = z.object({
    student: studentSchema,
    parent: baseUserSchema,
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;
type FormData = CreateFormData | UpdateFormData;



interface StudentParentFormProps {
    type: ModalType;
    data?: StudentData;
    onSubmitSuccess?: (data: StudentData) => void;
}




export default function StudentParentForm({
    type,
    data,
    onSubmitSuccess,
}: StudentParentFormProps) {
    const route = useRouter();
    const [loading, setLoading] = useState(false);
    const [classList, setClassList] = useState<ClassData[]>([]);

    const buildFormData = (formData: FormData, type: ModalType) => {
        const form = new FormData();
        console.log(formData);

        // Student
        const student = formData.student;
        form.append("student[username]", student.code);
        form.append("student[password]", student.code);
        form.append("student[email]", student.email);
        form.append("student[last_name]", student.last_name);
        form.append("student[first_name]", student.first_name);
        form.append("student[sex]", student.sex.toString());
        form.append("student[date_of_birth]", student.date_of_birth);
        form.append("student[address]", student.address);
        form.append("student[phone]", student.phone);
        form.append("student[identity_number]", student.identity_number);
        form.append("student[issued_date]", student.issued_date);
        form.append("student[issued_place]", student.issued_place);
        form.append("student[ethnicity]", student.ethnicity);
        form.append("student[religion]", student.religion);
        form.append("student[code]", student.code);
        form.append("student[place_of_birth]", student.place_of_birth);
        form.append("student[status]", student.status);
        form.append("student[class_id]", student.class_id.toString());

        // Parent
        const parent = formData.parent;
        form.append("parent[username]", student.code + "PH");
        form.append("parent[password]", student.code);
        form.append("parent[email]", parent.email);
        form.append("parent[last_name]", parent.last_name);
        form.append("parent[first_name]", parent.first_name);
        form.append("parent[sex]", parent.sex.toString());
        form.append("parent[date_of_birth]", parent.date_of_birth);
        form.append("parent[address]", parent.address);
        form.append("parent[phone]", parent.phone);
        form.append("parent[identity_number]", parent.identity_number);
        form.append("parent[issued_date]", parent.issued_date);
        form.append("parent[issued_place]", parent.issued_place);
        form.append("parent[ethnicity]", parent.ethnicity);
        form.append("parent[religion]", parent.religion);
        if (type === "update") {
            form.append("student[user_id]", data?.user_id.toString()!);
        }

        return form;
    };

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
        control,
    } = useForm<FormData>({
        resolver: zodResolver(type === "create" ? createSchema : updateSchema),
        defaultValues: {
            student: {
                code: data?.code ?? "",
                email: data?.user.email ?? "",
                last_name: data?.user.last_name ?? "",
                first_name: data?.user.first_name ?? "",
                sex: data?.user.sex ? 1 : 0,
                date_of_birth: data?.user.date_of_birth?.split("T")[0] ?? "",
                address: data?.user.address ?? "",
                phone: data?.user.phone ?? "",
                identity_number: data?.user.identity_number ?? "",
                issued_date: data?.user.issued_date?.split("T")[0] ?? "",
                issued_place: data?.user.issued_place ?? "",
                ethnicity: data?.user.ethnicity ?? "",
                religion: data?.user.religion ?? "",
                place_of_birth: data?.place_of_birth ?? "",
                class_id: data?.class_id ?? 0,
                status: data?.status ?? "studying",
            },
            parent: {
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
                religion: "",
                ethnicity: "",
            },
        },
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getclasses();
                if (res && res.data) {
                    if (res.data.length === 0) {
                        toast.error("Không có lớp học nào được tìm thấy. Vui lòng tạo lớp học trước.");
                        route.push("/admin/lists/classed");
                        return;
                    }
                    setClassList(res.data);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                toast.error(axiosErr.response?.data?.message || "Lỗi khi lấy danh sách lớp học");
            }
        };

        fetchClasses();

        if (type === "update" && data) {
            getParentByStudentCode(data.code)
                .then((res) => {
                    const user = res.data.user;
                    reset((prev) => ({
                        ...prev,
                        parent: {
                            email: user?.email ?? "",
                            last_name: user?.last_name ?? "",
                            first_name: user?.first_name ?? "",
                            sex: user?.sex ? 1 : 0,
                            date_of_birth: user?.date_of_birth?.split("T")[0] ?? "",
                            address: user?.address ?? "",
                            phone: user?.phone ?? "",
                            identity_number: user?.identity_number ?? "",
                            issued_date: user?.issued_date?.split("T")[0] ?? "",
                            issued_place: user?.issued_place ?? "",
                            religion: user?.religion ?? "",
                            ethnicity: user?.ethnicity ?? "",
                        },
                    }));
                })
                .catch(() => toast.error("Không thể tải thông tin phụ huynh"));
        }
    }, [type, data, reset]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            const form = buildFormData(formData, type);

            if (type === "create") {
                res = await addStudent(form); // Chắc chắn API `addStudent` hỗ trợ `FormData`
                toast.success("Thêm sinh viên thành công!");
            } else {
                res = await updateStudent(data!.code, form);
                toast.success("Cập nhật sinh viên thành công!");
            }
            onSubmitSuccess?.(res.data.student);
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
                {type === "create" ? "Thêm sinh viên và phụ huynh" : "Cập nhật thông tin"}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* --- SINH VIÊN --- */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Thông tin sinh viên</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <InputField id="student.code" label="Mã sinh viên" register={register("student.code")} error={errors.student?.code} readOnly={type === "update"} />
                        <InputField id="student.email" label="Email" register={register("student.email")} error={errors.student?.email} />
                        <InputField id="student.date_of_birth" label="Ngày sinh" type="date" register={register("student.date_of_birth")} error={errors.student?.date_of_birth} />
                        <InputField id="student.last_name" label="Họ" register={register("student.last_name")} error={errors.student?.last_name} />
                        <InputField id="student.first_name" label="Tên" register={register("student.first_name")} error={errors.student?.first_name} />
                        <SelectField id="student.sex" label="Giới tính" options={[{ label: "Nam", value: 1 }, { label: "Nữ", value: 0 }]} register={register("student.sex", { valueAsNumber: true })} error={errors.student?.sex} />
                        <InputField id="student.address" label="Địa chỉ" register={register("student.address")} error={errors.student?.address} />
                        <InputField id="student.phone" label="SĐT" register={register("student.phone")} error={errors.student?.phone} />
                        <InputField id="student.place_of_birth" label="Nơi sinh" register={register("student.place_of_birth")} error={errors.student?.place_of_birth} />
                        <SearchableSelectField id="student.class_id" name="student.class_id" label="Lớp học" control={control} options={classList.map((c) => ({ label: c.name, value: c.id }))} error={errors.student?.class_id} />
                        <InputField id="student.identity_number" label="CCCD" register={register("student.identity_number")} error={errors.student?.identity_number} />
                        <InputField id="student.issued_date" label="Ngày cấp" type="date" register={register("student.issued_date")} error={errors.student?.issued_date} />
                        <InputField id="student.issued_place" label="Nơi cấp" register={register("student.issued_place")} error={errors.student?.issued_place} />
                        <InputField id="student.ethnicity" label="Dân tộc" register={register("student.ethnicity")} error={errors.student?.ethnicity} />
                        <InputField id="student.religion" label="Tôn giáo" register={register("student.religion")} error={errors.student?.religion} />
                    </div>
                </div>

                {/* --- PHỤ HUYNH --- */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Thông tin phụ huynh</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <InputField id="parent.last_name" label="Họ" register={register("parent.last_name")} error={errors.parent?.last_name} />
                        <InputField id="parent.first_name" label="Tên" register={register("parent.first_name")} error={errors.parent?.first_name} />
                        <InputField id="parent.email" label="Email" register={register("parent.email")} error={errors.parent?.email} />
                        <InputField id="parent.date_of_birth" label="Ngày sinh" type="date" register={register("parent.date_of_birth")} error={errors.parent?.date_of_birth} />
                        <SelectField id="parent.sex" label="Giới tính" options={[{ label: "Nam", value: 1 }, { label: "Nữ", value: 0 }]} register={register("parent.sex", { valueAsNumber: true })} error={errors.parent?.sex} />
                        <InputField id="parent.address" label="Địa chỉ" register={register("parent.address")} error={errors.parent?.address} />
                        <InputField id="parent.phone" label="SĐT" register={register("parent.phone")} error={errors.parent?.phone} />
                        <InputField id="parent.identity_number" label="CCCD" register={register("parent.identity_number")} error={errors.parent?.identity_number} />
                        <InputField id="parent.issued_date" label="Ngày cấp" type="date" register={register("parent.issued_date")} error={errors.parent?.issued_date} />
                        <InputField id="parent.issued_place" label="Nơi cấp" register={register("parent.issued_place")} error={errors.parent?.issued_place} />
                        <InputField id="parent.ethnicity" label="Dân tộc" register={register("parent.ethnicity")} error={errors.parent?.ethnicity} />
                        <InputField id="parent.religion" label="Tôn giáo" register={register("parent.religion")} error={errors.parent?.religion} />
                    </div>
                </div>

                <div className="mt-4">
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
}
