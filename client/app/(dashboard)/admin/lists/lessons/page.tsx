"use client";

import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import FormModal from "@/components/form/FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { deleteLesson, getLessons } from "@/services/Lesson";
import { LessonData } from "@/types/LessonType";
import { getSemesters } from "@/services/Semesters";
import { getFacultys } from "@/services/Faculty";

const columnHelper = createColumnHelper<LessonData>();

const LessonPage = () => {
    const [lessonMap, setLessonMap] = useState<Map<number, LessonData>>(new Map());
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
    const [editingLesson, setEditingLesson] = useState<LessonData | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const [semesterId, setSemesterId] = useState<number | undefined>(undefined);
    const [semesters, setSemesters] = useState<any[]>([]);

    const [facultyId, setFacultyId] = useState<number | undefined>(undefined);
    const [faculties, setFaculties] = useState<any[]>([]);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await getSemesters();
                setSemesters(res.data);
            } catch {
                toast.error("Không thể tải danh sách học kỳ");
            }
        };

        const fetchFaculties = async () => {
            try {
                const res = await getFacultys();
                setFaculties(res.data);
            } catch {
                toast.error("Không thể tải danh sách khoa");
            }
        };

        fetchSemesters();
        fetchFaculties();
    }, []);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const res = await getLessons(facultyId, semesterId);
                const newMap = new Map<number, LessonData>();
                res.data.forEach((lesson: LessonData) => newMap.set(lesson.id, lesson));
                setLessonMap(newMap);
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                const message = axiosErr.response?.data?.message || axiosErr.message || "Lỗi khi tải danh sách.";
                toast.error(message, { description: "Vui lòng kiểm tra lại" });
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [semesterId, facultyId]);

    const handleAddSuccess = (lesson: LessonData) => {
        setLessonMap(prev => new Map(prev).set(lesson.id, lesson));
    };

    const handleUpdateSuccess = (lesson: LessonData) => {
        setLessonMap(prev => new Map(prev).set(lesson.id, lesson));
    };

    const handleDelete = async () => {
        if (!selectedLesson) return;
        try {
            await deleteLesson(selectedLesson.id);
            setLessonMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedLesson.id);
                return newMap;
            });
            toast.success("Xóa thành công");
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || "Lỗi khi xóa";
            toast.error("Xóa thất bại", { description: message });
        } finally {
            setShowConfirm(false);
            setSelectedLesson(null);
        }
    };

    const columns = [
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Chọn tất cả"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    aria-label="Chọn dòng"
                />
            ),
            size: 10,
        }),
        columnHelper.accessor("teacher_subject.subject.name", {
            id: "subject_name",
            header: (info) => <DefaultHeader info={info} name="Môn học" />,
            size: 200,
        }),
        columnHelper.accessor("teacher_subject.teacher_code", {
            id: "teacher_code",
            header: (info) => <DefaultHeader info={info} name="Mã GV" />,
            size: 120,
        }),
        columnHelper.accessor((r) => `${r.teacher_subject.teacher.user.last_name} ${r.teacher_subject.teacher.user.first_name}`, {
            id: "teacher_name",
            header: (info) => <DefaultHeader info={info} name="Tên GV" />,
            size: 120,
        }),
        columnHelper.accessor("room.name", {
            id: "room_id",
            header: (info) => <DefaultHeader info={info} name="Phòng" />,
            size: 120,
        }),
        columnHelper.accessor("day_of_week", {
            id: "day_of_week",
            header: (info) => <DefaultHeader info={info} name="Thứ" />,
            cell: ({ getValue }) => getValue().toString() === "7" ? "Chủ nhật" : `Thứ ${getValue() + 1}`,
            size: 80,
        }),
        columnHelper.accessor("start_time", {
            id: "start_time",
            header: (info) => <DefaultHeader info={info} name="Giờ bắt đầu" />,
            cell: ({ getValue }) =>
                new Date(`1970-01-01T${getValue()}`).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            size: 120,
        }),
        columnHelper.accessor("end_time", {
            id: "end_time",
            header: (info) => <DefaultHeader info={info} name="Giờ kết thúc" />,
            cell: ({ getValue }) =>
                new Date(`1970-01-01T${getValue()}`).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            size: 120,
        }),
        columnHelper.accessor("start_date", {
            id: "start_date",
            header: (info) => <DefaultHeader info={info} name="Bắt đầu" />,
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("vi-VN"),
            size: 120,
        }),
        columnHelper.accessor("end_date", {
            id: "end_date",
            header: (info) => <DefaultHeader info={info} name="Kết thúc" />,
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString("vi-VN"),
            size: 120,
        }),
        columnHelper.accessor("is_active", {
            id: "is_active",
            header: "Trạng thái",
            cell: ({ getValue }) => getValue() ? "Hoạt động" : "Không hoạt động",
            size: 120,
        }),
        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const lesson = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingLesson(lesson);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedLesson(lesson);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            size: 100,
        }),
    ];

    return (
        <div className="w-full p-4 bg-white">
            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <label className="text-sm font-semibold mr-2">Chọn học kỳ:</label>
                    <select
                        value={semesterId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSemesterId(value ? Number(value) : undefined);
                        }}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="">-- Tất cả học kỳ --</option>
                        {semesters.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold mr-2">Chọn khoa:</label>
                    <select
                        value={facultyId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFacultyId(value ? Number(value) : undefined);
                        }}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="">-- Tất cả khoa --</option>
                        {faculties.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách lesson...
                </div>
            ) : (
                <>
                    <DataTable<LessonData, any>
                        columns={columns}
                        data={Array.from(lessonMap.values())}
                        className="h-[calc(100vh-150px)]"
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingLesson(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="lesson"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingLesson && (
                        <FormModal
                            table="lesson"
                            type="update"
                            data={editingLesson}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingLesson(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa lesson “${selectedLesson?.teacher_subject.subject.name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedLesson(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default LessonPage;
