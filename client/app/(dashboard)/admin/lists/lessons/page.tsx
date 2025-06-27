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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { LessonData } from "@/types/LessonType";


const columnHelper = createColumnHelper<LessonData>();

const LessonPage = () => {
    const [lessonMap, setLessonMap] = useState<Map<number, LessonData>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
    const [editingLesson, setEditingLesson] = useState<LessonData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const res = await getLessons();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, LessonData>();
                    res.data.forEach((lesson: LessonData) => newMap.set(lesson.id, lesson));
                    setLessonMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách lesson:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách lesson.");
                }

                console.error("Lỗi khi lấy danh sách lesson:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

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
            toast.success("Xóa thành công")
        } catch (err: any) {
            const message =
                err?.response?.data?.message || // nếu từ axios hoặc fetch API
                err?.message || // nếu là Error object
                JSON.stringify(err); // nếu là object khác

            toast.error("Xóa thất bại", {
                description: message
            });
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
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
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
            meta: { displayName: "▢" },
            size: 10,
        }),

        columnHelper.accessor("teacher_subject.subject.id", {
            id: "subject_id",
            header: () => null,
            cell: () => null,
            meta: { hidden: true, displayName: "Mã môn học" },
        }),

        columnHelper.accessor("teacher_subject.subject.name", {
            id: "subject_name",
            header: (info) => <DefaultHeader info={info} name="Môn học" />,
            size: 200,
            enableGlobalFilter: true,
            meta: { displayName: "Môn học" },
        }),

        columnHelper.accessor("teacher_subject.teacher_code", {
            id: "teacher_code",
            header: (info) => <DefaultHeader info={info} name="Mã GV" />,
            size: 120,
            meta: { displayName: "Mã GV", hidden: true },
        }),


        columnHelper.accessor((r) => `${r.teacher_subject.teacher.user.last_name} ${r.teacher_subject.teacher.user.first_name}`, {
            id: "teacher_name",
            header: (info) => <DefaultHeader info={info} name="Tên GV" />,
            size: 120,
            meta: { displayName: "Tên GV" },
        }),

        columnHelper.accessor("room.name", {
            id: "room_id",
            header: (info) => <DefaultHeader info={info} name="Phòng" />,
            size: 120,
            meta: { displayName: "Phòng" },
        }),

        columnHelper.accessor("day_of_week", {
            id: "day_of_week",
            header: (info) => <DefaultHeader info={info} name="Thứ" />,
            cell: ({ getValue }) => getValue().toString() == "1" ? "Chủ nhật" : `Thứ ${getValue()}`,
            size: 80,
            meta: { displayName: "Thứ" },
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
            meta: { displayName: "Giờ bắt đầu" },
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
            meta: { displayName: "Giờ kết thúc" },
        }),

        columnHelper.accessor("start_date", {
            id: "start_date",
            header: (info) => <DefaultHeader info={info} name="Bắt đầu" />,
            cell: ({ getValue }) =>
                new Date(getValue()).toLocaleDateString("vi-VN"),
            size: 120,
            meta: { displayName: "Bắt đầu" },
        }),

        columnHelper.accessor("end_date", {
            id: "end_date",
            header: (info) => <DefaultHeader info={info} name="Kết thúc" />,
            cell: ({ getValue }) =>
                new Date(getValue()).toLocaleDateString("vi-VN"),
            size: 120,
            meta: { displayName: "Kết thúc" },
        }),

        columnHelper.accessor("is_active", {
            id: "is_active",
            header: (info) => <DefaultHeader info={info} name="Trạng thái" />,
            cell: ({ getValue }) =>
                getValue() ? "Hoạt động" : "Không hoạt động",
            size: 120,
            meta: { displayName: "Trạng thái" },
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
            enableGlobalFilter: false,
            size: 100,
            meta: { displayName: "Tùy chọn" },
        }),
    ];


    return (
        <div className="w-full p-4 bg-white">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách lesson...
                </div>
            ) : (
                <>
                    <DataTable<LessonData, any>
                        columns={columns}
                        data={Array.from(lessonMap.values())}
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
                        message={`Bạn có chắc chắn muốn xóa leson “${selectedLesson?.teacher_subject.subject}” không?`}
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
