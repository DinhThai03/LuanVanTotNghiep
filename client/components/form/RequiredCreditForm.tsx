"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import SelectField from "../select-field";
import InputField from "../input-field";
import { cn } from "@/lib/utils";

import { getFacultys } from "@/services/Faculty";
import { getRequiredCredits, addRequiredCredit } from "@/services/RequiredCredit";

import { FacultyData } from "@/types/FacultyType";
import { AxiosError } from "axios";
import { getCohorts } from "@/services/Cohort";
import { CohortData } from "@/types/CohortType";

const schema = z.object({
    cohort_id: z.coerce.number().min(1, "Vui lòng chọn niên khóa"),
    faculties: z.array(
        z.object({
            faculty_id: z.number(),
            required_credit: z.coerce.number().min(1, "Phải là số không âm"),
        })
    ),
});

type FormData = z.infer<typeof schema>;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("cohort_id", String(fd.cohort_id));

    fd.faculties.forEach((faculty, index) => {
        form.append(`faculties[${index}][faculty_id]`, String(faculty.faculty_id));
        form.append(`faculties[${index}][required_credit]`, String(faculty.required_credit));
    });

    return form;
};

export default function RequiredCreditForm() {
    const [cohorts, setCohorts] = useState<CohortData[]>([]);
    const [faculties, setFaculties] = useState<FacultyData[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            cohort_id: 0,
            faculties: [],
        },
    });

    const cohortId = watch("cohort_id");

    // Load niên khóa và khoa
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [cohortRes, facultyRes] = await Promise.all([
                    getCohorts(),
                    getFacultys(),
                ]);
                setCohorts(cohortRes);
                setFaculties(facultyRes.data);

                if (cohortRes.length > 0) {
                    setValue("cohort_id", cohortRes[0].id);
                }
            } catch {
                toast.error("Lỗi khi tải dữ liệu.");
            }
        };
        fetchInitialData();
    }, [setValue]);

    // Load dữ liệu tín chỉ yêu cầu theo niên khóa
    useEffect(() => {
        const fetchRequiredCredit = async () => {
            try {
                const res = await getRequiredCredits(cohortId);
                console.log(cohortId);
                const records = res || [];

                const facultyDefaults = faculties.map((faculty) => {
                    const existing = records.find((r: any) => r.faculty_id === faculty.id);
                    return {
                        faculty_id: faculty.id,
                        required_credit: existing?.required_credit ?? 0,
                    };
                });

                setValue("faculties", facultyDefaults);
            } catch {
                toast.error("Lỗi khi tải tín chỉ yêu cầu.");
                const facultyDefaults = faculties.map((faculty) => ({
                    faculty_id: faculty.id,
                    required_credit: 0,
                }));
                setValue("faculties", facultyDefaults);
            }
        };

        if (cohortId && faculties.length > 0) {
            fetchRequiredCredit();
        }
    }, [cohortId, faculties, setValue]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        try {
            await addRequiredCredit(buildFormData(data));
            toast.success("Lưu tín chỉ thành công!");
            console.log(data);
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            let message = "Đã có lỗi xảy ra.";

            if (axiosErr.response?.data?.message) {
                message = axiosErr.response.data.message;
            } else if (axiosErr.response?.data?.error) {
                message = axiosErr.response.data.error;
            } else if (axiosErr.message === "Network Error") {
                message = "Không thể kết nối đến server.";
            }

            toast.error(message, { description: "Vui lòng kiểm tra lại." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <h2 className="text-xl font-bold mb-4">Thiết lập tín chỉ tốt nghiệp theo niên khóa</h2>

            <div className="w-fit">
                <SelectField
                    id="cohort_id"
                    label="Niên khóa"
                    options={cohorts.map((c) => ({
                        label: `${c.start_year} - ${c.end_year}`,
                        value: c.id,
                    }))}
                    register={register("cohort_id", { valueAsNumber: true })}
                    error={errors.cohort_id}
                />
            </div>
            <div className='grid md:grid-cols-3 lg:grid-cols-4 gap-4'>

                {faculties.length > 0 && watch("faculties").length > 0 &&
                    watch("faculties").map((_, index) => (
                        <div key={index} className="p-4 space-y-2 border rounded-md">
                            <h3 className="font-semibold">{faculties[index].name}</h3>
                            <input
                                type="hidden"
                                {...register(`faculties.${index}.faculty_id`, {
                                    valueAsNumber: true,
                                })}
                                value={faculties[index].id}
                            />
                            <InputField
                                id={`faculties.${index}.required_credit`}
                                label="Tín chỉ yêu cầu"
                                type="number"
                                register={register(`faculties.${index}.required_credit`, {
                                    valueAsNumber: true,
                                })}
                                error={errors.faculties?.[index]?.required_credit}
                            />
                        </div>
                    ))}
            </div>

            <button
                type="submit"
                className={cn(
                    "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
                    { "opacity-50 pointer-events-none": loading }
                )}
            >
                {loading ? "Đang lưu..." : "Lưu thông tin"}
            </button>
        </form>
    );
}
