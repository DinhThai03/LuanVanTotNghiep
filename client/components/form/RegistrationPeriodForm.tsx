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
import { getSemesters } from "@/services/Semesters";
import { addRegistrationPeriod, getRegistrationPeriods } from "@/services/RegistrationPeriod";

import { AcademicYearData } from "@/types/AcademicYearType";
import { SemesterData } from "@/types/SemesterType";
import { FacultyData } from "@/types/FacultyType";
import { AxiosError } from "axios";
import { getAcademicYearsWithSemesters } from "@/services/AcademicYear";

const schema = z.object({
    academic_year_id: z.coerce.number().min(1, "Vui lòng chọn niên khóa"),
    semester_id: z.coerce.number().min(1, "Vui lòng chọn học kỳ"),
    faculties: z.array(
        z.object({
            faculty_id: z.number(),
            round1_start: z.string().min(1, "Bắt buộc"),
            round1_end: z.string().min(1, "Bắt buộc"),
            round2_start: z.string().min(1, "Bắt buộc"),
            round2_end: z.string().min(1, "Bắt buộc"),
        })
    ),
});

type FormData = z.infer<typeof schema>;

const buildFormData = (fd: FormData) => {
    const form = new FormData();
    form.append("academic_year_id", String(fd.academic_year_id));
    form.append("semester_id", String(fd.semester_id));

    fd.faculties.forEach((faculty, index) => {
        form.append(`faculties[${index}][faculty_id]`, String(faculty.faculty_id));
        form.append(`faculties[${index}][round1_start]`, faculty.round1_start);
        form.append(`faculties[${index}][round1_end]`, faculty.round1_end);
        form.append(`faculties[${index}][round2_start]`, faculty.round2_start);
        form.append(`faculties[${index}][round2_end]`, faculty.round2_end);
    });

    return form;
};

export default function RegistrationPeriodForm() {
    const [cohorts, setCohorts] = useState<AcademicYearData[]>([]);
    const [semesters, setSemesters] = useState<SemesterData[]>([]);
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
            academic_year_id: 0,
            semester_id: 0,
            faculties: [],
        },
    });

    const academicYearId = watch("academic_year_id");
    const semesterId = watch("semester_id");

    // Load năm học và khoa
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [ayRes, facultyRes] = await Promise.all([
                    getAcademicYearsWithSemesters(),
                    getFacultys(),
                ]);
                setCohorts(ayRes.data);
                setFaculties(facultyRes.data);

                if (ayRes.data.length > 0) {
                    setValue("academic_year_id", ayRes.data[0].id);
                }
            } catch {
                toast.error("Lỗi khi tải dữ liệu.");
            }
        };
        fetchInitialData();
    }, [setValue]);

    // Load học kỳ theo năm học
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await getSemesters(academicYearId);
                setSemesters(res.data);

                if (res.data.length > 0) {
                    setValue("semester_id", res.data[0].id);
                } else {
                    // Clear nếu không có học kỳ
                    setSemesters([]);
                    setValue("semester_id", 0);
                    setValue("faculties", []);
                }
            } catch {
                toast.error("Lỗi khi tải học kỳ.");
                setSemesters([]);
                setValue("semester_id", 0);
                setValue("faculties", []);
            }
        };

        if (academicYearId) {
            fetchSemesters();
        } else {
            setSemesters([]);
            setValue("semester_id", 0);
            setValue("faculties", []);
        }
    }, [academicYearId, setValue]);

    // Load thời gian đăng ký theo học kỳ
    useEffect(() => {
        const fetchRegistrationPeriods = async () => {
            try {
                const res = await getRegistrationPeriods(semesterId);
                const periods = res.faculties;

                const facultyDefaults = faculties.map((faculty) => {
                    const existing = periods.find(
                        (p: any) => p.faculty_id === faculty.id
                    );

                    return {
                        faculty_id: faculty.id,
                        round1_start: existing?.round1_start?.slice(0, 10) || "",
                        round1_end: existing?.round1_end?.slice(0, 10) || "",
                        round2_start: existing?.round2_start?.slice(0, 10) || "",
                        round2_end: existing?.round2_end?.slice(0, 10) || "",
                    };
                });

                setValue("faculties", facultyDefaults);
            } catch (error) {
                toast.error("Lỗi khi tải thời gian đăng ký.");

                // Trường hợp lỗi hoặc không có dữ liệu → reset dữ liệu ngày về rỗng
                const facultyDefaults = faculties.map((faculty) => ({
                    faculty_id: faculty.id,
                    round1_start: "",
                    round1_end: "",
                    round2_start: "",
                    round2_end: "",
                }));

                setValue("faculties", facultyDefaults);
            }
        };

        if (semesterId && faculties.length > 0) {
            fetchRegistrationPeriods();
        } else if (faculties.length > 0) {
            // Nếu chưa có semester nhưng vẫn muốn reset form faculty
            const facultyDefaults = faculties.map((faculty) => ({
                faculty_id: faculty.id,
                round1_start: "",
                round1_end: "",
                round2_start: "",
                round2_end: "",
            }));

            setValue("faculties", facultyDefaults);
        }
    }, [semesterId, faculties, setValue]);


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        try {
            await addRegistrationPeriod(buildFormData(data));
            toast.success("Lưu thành công!");
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
            <h2 className="text-xl font-bold mb-4">
                Thiết lập thời gian đăng ký học phần
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <SelectField
                    id="academic_year_id"
                    label="Năm học"
                    options={cohorts.map((ay) => ({
                        label: `${ay.start_year} - ${ay.end_year}`,
                        value: ay.id,
                    }))}
                    register={register("academic_year_id", { valueAsNumber: true })}
                    error={errors.academic_year_id}
                />

                <SelectField
                    id="semester_id"
                    label="Học kỳ"
                    options={semesters.map((s) => ({
                        label: s.name,
                        value: s.id,
                    }))}
                    register={register("semester_id", { valueAsNumber: true })}
                    error={errors.semester_id}
                />
            </div>

            {faculties.length > 0 && watch("faculties").length > 0 && watch("faculties").map((_, index) => (
                <div key={index} className="p-4 space-y-4 border rounded-md">
                    <h3 className="font-semibold mb-2">{faculties[index].name}</h3>
                    <input
                        type="hidden"
                        {...register(`faculties.${index}.faculty_id`, {
                            valueAsNumber: true,
                        })}
                        value={faculties[index].id}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InputField
                            id={`faculties.${index}.round1_start`}
                            label="Đợt 1 - Bắt đầu"
                            type="date"
                            register={register(`faculties.${index}.round1_start`)}
                            error={errors.faculties?.[index]?.round1_start}
                        />
                        <InputField
                            id={`faculties.${index}.round1_end`}
                            label="Đợt 1 - Kết thúc"
                            type="date"
                            register={register(`faculties.${index}.round1_end`)}
                            error={errors.faculties?.[index]?.round1_end}
                        />
                        <InputField
                            id={`faculties.${index}.round2_start`}
                            label="Đợt 2 - Bắt đầu"
                            type="date"
                            register={register(`faculties.${index}.round2_start`)}
                            error={errors.faculties?.[index]?.round2_start}
                        />
                        <InputField
                            id={`faculties.${index}.round2_end`}
                            label="Đợt 2 - Kết thúc"
                            type="date"
                            register={register(`faculties.${index}.round2_end`)}
                            error={errors.faculties?.[index]?.round2_end}
                        />
                    </div>
                </div>
            ))}

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
