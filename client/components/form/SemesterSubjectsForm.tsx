"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, FieldError, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import CheckboxGroupField from "../checkbox-group-field";
import SelectField from "../select-field";

import { getFacultys } from "@/services/Faculty";
import { getSubjectsByFaculty } from "@/services/Subject";
import { getSemesters } from "@/services/Semesters";
import { getSubjectsFromSemester, storeOrUpdateSemesterSubjects } from "@/services/SemesterSubjects";

import { FacultyData } from "@/types/FacultyType";
import { SubjectData } from "@/types/SubjectType";
import { SemesterData } from "@/types/SemesterType";
import { ConfirmDialog } from "../confirm-dialog";

const schema = z.object({
    semester_id: z.coerce.number().min(1, "Vui lòng chọn học kỳ"),
    subject_ids: z.array(z.coerce.number()).min(1, "Vui lòng chọn ít nhất một môn học"),
});

type FormData = z.infer<typeof schema>;

interface SemesterSubjectFormProps {
    onSubmitSuccess?: () => void;
}

export default function SemesterSubjectForm({ onSubmitSuccess }: SemesterSubjectFormProps) {
    const [loading, setLoading] = useState(false);
    const [faculties, setFaculties] = useState<FacultyData[]>([]);
    const [semesters, setSemesters] = useState<SemesterData[]>([]);
    const [facultySubjects, setFacultySubjects] = useState<Record<number, SubjectData[]>>({});
    const [mode, setMode] = useState<"create" | "update">("create");
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // ✅ dialog state

    const {
        register,
        handleSubmit,
        control,
        setError,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            semester_id: 0,
            subject_ids: [],
        },
    });

    const watchedSemesterId = watch("semester_id");

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [facultyRes, semesterRes] = await Promise.all([
                    getFacultys(),
                    getSemesters(),
                ]);

                const facultiesData = facultyRes.data;
                const semestersData = semesterRes.data;

                setFaculties(facultiesData);
                setSemesters(semestersData);

                const subjectResults = await Promise.all(
                    facultiesData.map((f: FacultyData) =>
                        getSubjectsByFaculty(f.id).then((subjects) => ({
                            facultyId: f.id,
                            subjects,
                        }))
                    )
                );

                const groupedSubjects: Record<number, SubjectData[]> = {};
                subjectResults.forEach(({ facultyId, subjects }) => {
                    groupedSubjects[facultyId] = subjects;
                });

                setFacultySubjects(groupedSubjects);

                if (semestersData.length > 0 && !initialLoadDone) {
                    const firstSemesterId = semestersData[0].id;
                    setValue("semester_id", firstSemesterId);
                    setInitialLoadDone(true);
                }
            } catch (err) {
                toast.error("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [initialLoadDone, setValue]);

    useEffect(() => {
        if (!watchedSemesterId) return;

        const fetchSubjects = async () => {
            try {
                const res = await getSubjectsFromSemester(watchedSemesterId);
                const ids = res.data;

                if (ids.length > 0) {
                    setMode("update");
                    setValue("subject_ids", ids);
                } else {
                    setMode("create");
                    setValue("subject_ids", []);
                }
            } catch (err) {
                toast.error("Lỗi khi kiểm tra môn học trong học kỳ");
            }
        };

        fetchSubjects();
    }, [watchedSemesterId, setValue]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('semester_id', formData.semester_id.toString());
            formData.subject_ids.forEach(id => data.append("subject_ids[]", String(id)));

            await storeOrUpdateSemesterSubjects(data);
            toast.success(mode === "create" ? "Thêm thành công!" : "Cập nhật thành công!");
            onSubmitSuccess?.();
        } catch (err: any) {
            if (err.response?.status === 422 && err.response.data.errors) {
                Object.entries(err.response.data.errors).forEach(([key, val]) => {
                    setError(key as keyof FormData, {
                        type: "server",
                        message: (val as string[])[0],
                    });
                });
            }
            toast.error("Đã tổ chức giảng dạy, không thể thay đổi môn");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSubmit = () => {
        handleSubmit(onSubmit)();
        setShowConfirm(false);
    };

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 p-4">
                <h2 className="text-xl font-bold mb-4">
                    {mode === "create" ? "Thêm môn học cho học kỳ" : "Cập nhật môn học học kỳ"}
                </h2>

                <div className="grid grid-cols-3 gap-4">
                    <SelectField
                        id="semester_id"
                        label="Học kỳ"
                        options={semesters.map((s) => ({
                            label: `${s.name} (${s.academic_year.start_year} - ${s.academic_year.end_year})`,
                            value: s.id,
                        }))}
                        register={register("semester_id", { valueAsNumber: true })}
                        error={errors.semester_id}
                    />
                </div>

                {faculties.map((faculty) => {
                    const subjects = facultySubjects[faculty.id] || [];
                    if (subjects.length === 0) return null;

                    return (
                        <div key={faculty.id}>
                            <CheckboxGroupField
                                id={`subject_ids_${faculty.id}`}
                                label={faculty.name}
                                name="subject_ids"
                                control={control}
                                options={subjects.map((s) => ({
                                    label: s.name,
                                    value: s.id,
                                }))}
                                error={errors.subject_ids as FieldError}
                            />
                        </div>
                    );
                })}

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)} // ✅ mở confirm dialog
                        className={cn(
                            "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
                            { "opacity-50 pointer-events-none": loading }
                        )}
                    >
                        {loading
                            ? "Đang xử lý..."
                            : mode === "create"
                                ? "Tạo mới"
                                : "Cập nhật"}
                    </button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirm}
                title="Xác nhận gửi thông tin"
                message={`Bạn có chắc chắn muốn ${mode === "create" ? "thêm" : "cập nhật"} danh sách môn học cho học kỳ này?`}
                confirmText="Xác nhận"
                cancelText="Hủy"
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmSubmit}
            />
        </>
    );
}
