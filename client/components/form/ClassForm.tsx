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
import { ClassedData } from "@/types/ClassedType";
import { addClassed, getclasses, updateClassed } from "@/services/Classed";
import SelectField from "../select-field";
import SearchableSelectField from "../searchable-select-field";
import { FacultyData } from "@/types/FacultyType";
import { getFacultys } from "@/services/Faculty";
import { CohortData } from "@/types/CohortType";
import { getCohorts } from "@/services/Cohort";
import { useRouter } from "next/navigation";

const classeschema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Tên lớp không được để trống"),
    student_count: z.coerce.number().min(1, "Sĩ số phải lớn hơn 0"),
    faculty_id: z.coerce.number().min(1, "Vui lòng chọn khoa"),
    cohort_id: z.coerce.number().min(1, "Vui lòng chọn khoa"),
});

type FormData = z.infer<typeof classeschema>;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("name", fd.name);
    form.append("student_count", String(fd.student_count));
    form.append("faculty_id", String(fd.faculty_id));
    form.append("cohort_id", String(fd.cohort_id));
    return form;
};

interface ClassedFormProps {
    type: ModalType;
    data?: ClassedData;
    onSubmitSuccess?: (classed: ClassedData) => void;
}
export const ClassedForm = ({
    type,
    data,
    onSubmitSuccess,
}: ClassedFormProps) => {
    const route = useRouter();
    const [loading, setLoading] = useState(false);
    const [facultys, setFaculty] = useState<FacultyData[]>([]);
    const [cohorts, setCohorts] = useState<CohortData[]>([]);

    const [isFacultyLoaded, setIsFacultyLoaded] = useState(false);
    const [isCohortLoaded, setIsCohortLoaded] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        control,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(classeschema),
        defaultValues: {
            id: data?.id,
            name: data?.name ?? "",
            student_count: data?.student_count ?? 30,
            faculty_id: data?.faculty_id ?? undefined,
            cohort_id: data?.cohort_id ?? undefined,
        },
    });

    useEffect(() => {
        const fetchFacultys = async () => {
            try {
                setLoading(true);
                const res = await getFacultys();
                if (res) {
                    if (res.data.length === 0) {
                        toast.error("Không có khoa nào được tìm thấy. Vui lòng tạo khoa trước.");
                        route.push("/admin/lists/facultys");
                        return;
                    }
                    setFaculty(res.data);
                    setIsFacultyLoaded(true);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message = "Đã có lỗi xảy ra khi lấy danh sách khoa.";
                if (axiosErr.response?.data?.message) {
                    message = axiosErr.response.data.message;
                } else if (axiosErr.response?.data?.error) {
                    message = axiosErr.response.data.error;
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

        const fetchCohorts = async () => {
            try {
                setLoading(true);
                const res = await getCohorts();
                if (res) {
                    if (res.length === 0) {
                        toast.error("Không có niên khóa nào được tìm thấy. Vui lòng tạo niên khóa trước.");
                        route.push("/admin/lists/cohorts");
                        return;
                    }
                    setCohorts(res);
                    setIsCohortLoaded(true);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message = "Đã có lỗi xảy ra khi lấy danh sách niên khóa.";
                if (axiosErr.response?.data?.message) {
                    message = axiosErr.response.data.message;
                } else if (axiosErr.response?.data?.error) {
                    message = axiosErr.response.data.error;
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

        fetchFacultys();
        fetchCohorts();
    }, []);

    useEffect(() => {
        if (data) {
            reset({
                id: data.id,
                name: data.name,
                student_count: data.student_count,
                faculty_id: data.faculty_id,
                cohort_id: data.cohort_id,
            });
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            let res;
            if (type === "create") {
                res = await addClassed(buildFormData(formData));
                toast.success(res.data.message || "Thêm lớp thành công");
            } else {
                res = await updateClassed(formData.id!, buildFormData(formData));
                toast.success(res.data.message || "Cập nhật lớp thành công");
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
                {type === "create" ? "Thêm lớp học" : "Cập nhật lớp học"}
            </h2>

            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <InputField
                    id="name"
                    label="Tên lớp"
                    type="text"
                    register={register("name")}
                    error={errors.name}
                />

                <InputField
                    id="student_count"
                    label="Sĩ số"
                    type="number"
                    register={register("student_count", { valueAsNumber: true })}
                    error={errors.student_count}
                />

                {isFacultyLoaded && (
                    <SearchableSelectField
                        id="faculty_id"
                        name="faculty_id"
                        label="Khoa"
                        control={control}
                        options={facultys.map((f) => ({
                            label: f.name,
                            value: f.id,
                        }))}
                        placeholder="Chọn Khoa..."
                        error={errors.faculty_id}
                    />
                )}

                {isCohortLoaded && (
                    <SearchableSelectField
                        id="cohort_id"
                        name="cohort_id"
                        label="Niên khóa"
                        control={control}
                        options={cohorts.map((c) => ({
                            label: c.name,
                            value: c.id,
                        }))}
                        placeholder="Chọn niên khóa..."
                        error={errors.cohort_id}
                    />
                )}

                <div className="mt-4 col-span-2">
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
