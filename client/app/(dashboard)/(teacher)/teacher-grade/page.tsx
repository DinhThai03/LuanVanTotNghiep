"use client";

import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import FormModal from "@/components/form/FormModal";

import { getLessonsNotEnteredByTeacher } from "@/services/Lesson";
import { importGrades } from "@/services/Grade";
import { LessonData } from "@/types/LessonType";
import { profile } from "@/features/auth/api";
import { getOneTeachers } from "@/services/Teacher";

const columnHelper = createColumnHelper<LessonData>();

const LessonPage = () => {
    const [lessonMap, setLessonMap] = useState<Map<number, LessonData>>(new Map());
    const [loading, setLoading] = useState(true);
    const [editingLesson, setEditingLesson] = useState<LessonData | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const pRes = await profile();
                const tRes = await getOneTeachers(pRes.id);
                const res = await getLessonsNotEnteredByTeacher(tRes.code, 6);
                const newMap = new Map<number, LessonData>();
                res.forEach((lesson: LessonData) => newMap.set(lesson.id, lesson));
                setLessonMap(newMap);
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                const message = axiosErr.response?.data?.message || axiosErr.message || "Lỗi khi tải danh sách.";
                toast.error(message, { description: "Vui lòng kiểm tra lại" });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddSuccess = (lesson: LessonData) => {
        setLessonMap(prev => new Map(prev).set(lesson.id, lesson));
    };

    const handleUpdateSuccess = (lesson: LessonData) => {
        setLessonMap(prev => new Map(prev).set(lesson.id, lesson));
    };

    const handleUpload = async (formData: FormData) => {
        try {
            if (!editingLesson?.id) throw new Error("Chưa chọn buổi học để nhập điểm");

            await importGrades(formData, editingLesson.id);
            toast.success("Nhập dữ liệu thành công!");

            // Cập nhật trạng thái sau khi nhập
            setLessonMap(prev => {
                const newMap = new Map(prev);
                const lesson = newMap.get(editingLesson.id);
                if (lesson) {
                    lesson.grade_status = "pending"; // hoặc "graded" nếu bạn xác định luôn là đã chấm
                    newMap.set(lesson.id, lesson);
                }
                return newMap;
            });

            setShowAddForm(false);
            setEditingLesson(null);
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            const resData = axiosErr.response?.data;

            if (axiosErr.response?.status === 422) {
                if (Array.isArray(resData?.errors)) {
                    const errors = resData.errors;
                    if (errors.length <= 5) {
                        errors.forEach((errObj: any) => {
                            const row = errObj.row;
                            const messages = Object.entries(errObj.errors)
                                .map(([field, msgList]) => `${field}: ${Array.isArray(msgList) ? msgList.join(', ') : msgList}`)
                                .join(' | ');
                            toast.error(`Dòng ${row}: ${messages}`);
                        });
                    } else {
                        toast.error(`Có ${errors.length} dòng lỗi. Vui lòng kiểm tra chi tiết.`);
                    }
                } else if (resData?.errors && typeof resData.errors === 'object') {
                    Object.entries(resData.errors).forEach(([field, messages]) => {
                        const msg = Array.isArray(messages) ? messages.join(', ') : messages;
                        toast.error(`${field}: ${msg}`);
                    });
                }
                return;
            }

            if (axiosErr.response?.status === 413) {
                toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn.");
                return;
            }

            toast.error(resData?.message || "Đã xảy ra lỗi không xác định.");
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
        columnHelper.accessor("id", {
            id: "id",
            header: "ID",
            size: 50,
        }),
        columnHelper.accessor("teacher_subject.subject.name", {
            id: "subject_name",
            header: (info) => <DefaultHeader info={info} name="Môn học" />,
            size: 200,
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
        columnHelper.accessor("grade_status", {
            id: "grade_status",
            header: "Nhập điểm",
            cell: ({ row, getValue }) => {
                const status = getValue();
                const lesson = row.original;
                const text = status === "not_entered" ? "Nhập điểm" : status === "pending" ? "Cập nhật" : "Đã nhập";
                const bgColor =
                    status === "not_entered"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "";

                return (
                    <span
                        className={`px-2 py-1 rounded cursor-pointer ${bgColor}`}
                        onClick={() => {
                            if (status === "not_entered" || status === "pending") {
                                setEditingLesson(lesson);
                                setShowAddForm(true);
                            }
                        }}
                    >
                        {text}
                    </span>
                );
            },
            size: 150,
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
                        className="h-[calc(100vh-150px)]"
                    />

                    {showAddForm && editingLesson && (
                        <FormModal
                            table="import"
                            type="create"
                            onClose={() => {
                                setShowAddForm(false);
                                setEditingLesson(null);
                            }}
                            onSubmitSuccess={handleAddSuccess}
                            onUpload={handleUpload}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default LessonPage;
