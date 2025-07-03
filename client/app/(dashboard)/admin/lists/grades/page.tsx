"use client";

import { useEffect, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";

import { GradeData } from "@/types/GradeType";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import FormModal from "@/components/form/FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { getGrades, deleteGrade } from "@/services/Grade";
import { getAcademicYears } from "@/services/AcademicYear";
import { getSemesters } from "@/services/Semesters";
import { getclasses } from "@/services/Classed";
import { getLessons } from "@/services/Lesson";

import { AcademicYearData } from "@/types/AcademicYearType";
import { SemesterData } from "@/types/SemesterType";
import { ClassedData } from "@/types/ClassedType";
import { LessonData } from "@/types/LessonType";

const columnHelper = createColumnHelper<GradeData>();

const GradesPage = () => {
    const [gradeMap, setGradeMap] = useState<Map<number, GradeData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [academicYearId, setAcademicYearId] = useState<number | undefined>();
    const [semesterId, setSemesterId] = useState<number | undefined>();
    const [classId, setClassId] = useState<number | undefined>();
    const [lessonId, setLessonId] = useState<number | undefined>();

    const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);
    const [semesters, setSemesters] = useState<SemesterData[]>([]);
    const [classes, setClasses] = useState<ClassedData[]>([]);
    const [lessons, setLessons] = useState<LessonData[]>([]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<GradeData | null>(null);
    const [editingGrade, setEditingGrade] = useState<GradeData | null>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    // Load Academic Years
    useEffect(() => {
        const fetchAY = async () => {
            try {
                const res = await getAcademicYears();
                setAcademicYears(res.data);
            } catch {
                toast.error("Không thể tải danh sách niên khóa");
            }
        };
        fetchAY();
    }, []);

    // Load Semesters when AcademicYear changes
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                if (!academicYearId) {
                    setSemesters([]);
                    setSemesterId(undefined);
                    return;
                }
                const res = await getSemesters(academicYearId);
                setSemesters(res.data);
                setSemesterId(undefined);
            } catch {
                toast.error("Không thể tải học kỳ");
            }
        };
        fetchSemesters();
    }, [academicYearId]);

    // Load Classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getclasses();
                setClasses(res.data);
            } catch {
                toast.error("Không thể tải lớp");
            }
        };
        fetchClasses();
    }, []);

    // Load Lessons (ưu tiên semester → academicYear → all)
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                if (semesterId) {
                    const res = await getLessons(undefined, semesterId);
                    setLessons(res.data);
                } else if (academicYearId) {
                    const res = await getLessons(academicYearId);
                    setLessons(res.data);
                } else {
                    const res = await getLessons();
                    setLessons(res.data);
                }
            } catch {
                toast.error("Không thể tải buổi học");
            }
        };
        fetchLessons();
    }, [academicYearId, semesterId]);

    // Fetch Grades
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                setLoading(true);
                const res = await getGrades(academicYearId, semesterId, classId, lessonId);
                const newMap = new Map<number, GradeData>();
                res.forEach((grade: GradeData) => newMap.set(grade.registration_id, grade));
                setGradeMap(newMap);
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                const message =
                    axiosErr.response?.data?.message ||
                    axiosErr.response?.data?.error ||
                    axiosErr.message ||
                    "Lỗi khi tải danh sách điểm.";
                toast.error(message, { description: "Vui lòng kiểm tra lại" });
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [academicYearId, semesterId, classId, lessonId]);

    const handleUpdateSuccess = (grade: GradeData) => {
        setGradeMap((prev) => new Map(prev).set(grade.registration_id, grade));
    };

    const handleDelete = async () => {
        if (!selectedGrade) return;
        try {
            await deleteGrade(selectedGrade.registration_id);
            setGradeMap((prev) => {
                const newMap = new Map(prev);
                newMap.delete(selectedGrade.registration_id);
                return newMap;
            });
            toast.success("Xóa thành công");
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || JSON.stringify(err);
            toast.error("Xóa thất bại", { description: message });
        } finally {
            setShowConfirm(false);
            setSelectedGrade(null);
        }
    };

    const columns = [
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    aria-label="Select row"
                />
            ),
            size: 30,
        }),
        columnHelper.accessor((r) => r.registration.student.code, {
            id: "student_code",
            header: (info) => <DefaultHeader info={info} name="Mã SV" />,
            size: 100,
        }),
        columnHelper.accessor(
            (r) => `${r.registration.student.user.last_name} ${r.registration.student.user.first_name}`,
            {
                id: "student_name",
                header: (info) => <DefaultHeader info={info} name="Họ tên" />,
                size: 160,
            }
        ),
        columnHelper.accessor((r) => r.registration.lesson.teacher_subject.subject.name, {
            id: "subject_name",
            header: (info) => <DefaultHeader info={info} name="Môn học" />,
            size: 180,
        }),
        columnHelper.accessor((r) => r.process_score, {
            id: "process_score",
            header: (info) => <DefaultHeader info={info} name="Điểm QT" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.midterm_score, {
            id: "midterm_score",
            header: (info) => <DefaultHeader info={info} name="Điểm GK" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.final_score, {
            id: "final_score",
            header: (info) => <DefaultHeader info={info} name="Điểm CK" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.average_score, {
            id: "average_score",
            header: (info) => <DefaultHeader info={info} name="Điểm TB" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.letter_grade, {
            id: "letter_grade",
            header: (info) => <DefaultHeader info={info} name="Điểm chữ" />,
            size: 90,
        }),
        columnHelper.accessor((r) => r.result, {
            id: "result",
            header: (info) => <DefaultHeader info={info} name="Kết quả" />,
            cell: ({ getValue }) => {
                const result = getValue();
                return (
                    <span className={`px-2 py-1 rounded text-white text-sm font-medium ${result ? result == 1 ? "bg-green-500" : "bg-red-500" : ""}`}>
                        {result && (result == 1 ? "Đạt" : "Không đạt")}
                    </span>
                );
            },
            size: 100,
        }),
        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const grade = row.original;
                return (
                    <button
                        className="text-orange-500 text-lg"
                        onClick={() => {
                            setEditingGrade(grade);
                            setShowUpdateForm(true);
                        }}
                    >
                        <FaRegPenToSquare />
                    </button>
                );
            },
            size: 100,
        }),
    ];

    return (
        <div className="w-full p-4 bg-white shadow rounded">
            <div className="flex gap-4 mb-4 max-w-full overflow-x-auto">
                <div>
                    <label className="text-sm font-semibold mr-2">Niên khóa:</label>
                    <select
                        className="border rounded p-2"
                        value={academicYearId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value ? Number(e.target.value) : undefined;
                            setAcademicYearId(value);
                        }}
                    >
                        <option value="">--- Tất cả ---</option>
                        {academicYears.map((ay) => (
                            <option key={ay.id} value={ay.id}>
                                {ay.start_year} - {ay.end_year}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold mr-2">Học kỳ:</label>
                    <select
                        className="border rounded p-2"
                        value={semesterId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value ? Number(e.target.value) : undefined;
                            setSemesterId(value);
                        }}
                    >
                        <option value="">--- Tất cả ---</option>
                        {semesters.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold mr-2">Lớp:</label>
                    <select
                        className="border rounded p-2"
                        value={classId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value ? Number(e.target.value) : undefined;
                            setClassId(value);
                        }}
                    >
                        <option value="">--- Tất cả ---</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold mr-2">Buổi học:</label>
                    <select
                        className="border rounded p-2"
                        value={lessonId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value ? Number(e.target.value) : undefined;
                            setLessonId(value);
                            setClassId(undefined); // reset class
                        }}
                    >
                        <option value="">--- Tất cả ---</option>
                        {lessons.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.teacher_subject.subject?.name} - {l.teacher_subject.teacher?.user.last_name} {l.teacher_subject.teacher?.user.first_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Đang tải danh sách điểm...</div>
            ) : (
                <>
                    <DataTable<GradeData, any>
                        columns={columns}
                        data={Array.from(gradeMap.values())}
                        className="h-[calc(100vh-150px)]"
                    />
                    {showUpdateForm && editingGrade && (
                        <FormModal
                            table="grade"
                            type="update"
                            data={editingGrade}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingGrade(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}
                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa grade “${selectedGrade?.registration_id}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedGrade(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default GradesPage;
