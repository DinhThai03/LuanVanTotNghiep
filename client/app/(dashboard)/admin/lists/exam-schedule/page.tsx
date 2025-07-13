"use client";

import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/confirm-dialog";
import FormModal from "@/components/form/FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { deleteExamSchedule, getExamSchedules } from "@/services/ExamSchedule";
import { ExamSchedule } from "@/types/ExamType";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const columnHelper = createColumnHelper<ExamSchedule>();

const ExamSchedulePage = () => {
    const [examScheduleMap, setExamScheduleMap] = useState<Map<number, ExamSchedule>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedExamSchedule, setSelectedExamSchedule] = useState<ExamSchedule | null>(null);
    const [editingExamSchedule, setEditingExamSchedule] = useState<ExamSchedule | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchExamSchedules = async () => {
            try {
                setLoading(true);
                const res = await getExamSchedules();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, ExamSchedule>();
                    res.forEach((examSchedule: ExamSchedule) => newMap.set(examSchedule.id, examSchedule));
                    setExamScheduleMap(newMap);
                    console.log(res);

                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách examSchedule:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách examSchedule.");
                }

                console.error("Lỗi khi lấy danh sách examSchedule:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchExamSchedules();
    }, []);

    const handleAddSuccess = (examSchedule: ExamSchedule) => {
        setExamScheduleMap(prev => new Map(prev).set(examSchedule.id, examSchedule));
    };

    const handleUpdateSuccess = (examSchedule: ExamSchedule) => {
        setExamScheduleMap(prev => new Map(prev).set(examSchedule.id, examSchedule));
    };

    const handleDelete = async () => {
        if (!selectedExamSchedule) return;
        try {
            await deleteExamSchedule(selectedExamSchedule.id);
            setExamScheduleMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedExamSchedule.id);
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
            setSelectedExamSchedule(null);
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
            size: 5,
        }),

        columnHelper.accessor("semester_subject.subject.code", {
            id: "subject_code",
            header: () => "Mã môn",
            cell: (info) => info.getValue(),
            meta: { displayName: "Mã môn" },
            size: 100,
        }),

        columnHelper.accessor("semester_subject.subject.name", {
            id: "subject_name",
            header: () => "Tên môn",
            cell: (info) => info.getValue(),
            meta: { displayName: "Tên môn" },
            size: 120,
        }),

        columnHelper.accessor((r) => format(new Date(r.exam_date), "dd/MM/yyyy", { locale: vi }), {
            id: "exam_date",
            header: () => "Ngày thi",
            cell: (info) => info.getValue(),
            meta: { displayName: "Ngày thi" },
            size: 60,
        }),

        columnHelper.accessor("exam_time", {
            id: "exam_time",
            header: () => "Giờ thi",
            cell: (info) => info.getValue().slice(0, 5), // chỉ lấy HH:mm
            meta: { displayName: "Giờ thi" },
            size: 60,
        }),

        columnHelper.accessor("duration", {
            id: "duration",
            header: () => "Thời lượng (phút)",
            cell: (info) => info.getValue(),
            meta: { displayName: "Thời lượng" },
            size: 100,
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const examSchedule = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingExamSchedule(examSchedule);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedExamSchedule(examSchedule);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            enableGlobalFilter: false,
            size: 50,
            meta: { displayName: "Tùy chọn" },
        }),
    ];


    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách examSchedule...
                </div>
            ) : (
                <>
                    <DataTable<ExamSchedule, any>
                        columns={columns}
                        data={Array.from(examScheduleMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingExamSchedule(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="examSchedule"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingExamSchedule && (
                        <FormModal
                            table="examSchedule"
                            type="update"
                            data={editingExamSchedule}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingExamSchedule(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa lịch thi này không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedExamSchedule(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default ExamSchedulePage;
