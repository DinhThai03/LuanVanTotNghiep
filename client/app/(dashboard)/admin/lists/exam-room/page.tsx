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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ExamRoomData } from "@/types/ExamType";
import { deleteExamRoom, getExamRooms } from "@/services/ExamRoom";
import { DefaultHeader } from "@/components/ui/defautl-header";

const columnHelper = createColumnHelper<ExamRoomData>();

const ExamRoomPage = () => {
    const [examRoomMap, setExamRoomMap] = useState<Map<number, ExamRoomData>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedExamRoom, setSelectedExamRoom] = useState<ExamRoomData | null>(null);
    const [editingExamRoom, setEditingExamRoom] = useState<ExamRoomData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchExamRooms = async () => {
            try {
                setLoading(true);
                const res = await getExamRooms();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, ExamRoomData>();
                    res.forEach((examRoom: ExamRoomData) => newMap.set(examRoom.id, examRoom));
                    setExamRoomMap(newMap);
                    console.log(res);

                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách examRoom:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách examRoom.");
                }

                console.error("Lỗi khi lấy danh sách examRoom:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchExamRooms();
    }, []);

    const handleAddSuccess = (examRoom: ExamRoomData) => {
        setExamRoomMap(prev => new Map(prev).set(examRoom.id, examRoom));
    };

    const handleUpdateSuccess = (examRoom: ExamRoomData) => {
        setExamRoomMap(prev => new Map(prev).set(examRoom.id, examRoom));
    };

    const handleDelete = async () => {
        if (!selectedExamRoom) return;
        try {
            await deleteExamRoom(selectedExamRoom.id);
            setExamRoomMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedExamRoom.id);
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
            setSelectedExamRoom(null);
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
            meta: { displayName: "Chọn" },
            size: 30,
        }),

        columnHelper.accessor((r) => r.exam_schedule.exam_date, {
            id: "exam_date",
            header: (info) => <DefaultHeader info={info} name="Ngày thi" />,
            meta: { displayName: "Ngày thi" },
            size: 120,
        }),

        columnHelper.accessor((r) => r.exam_schedule.exam_time, {
            id: "exam_time",
            header: (info) => <DefaultHeader info={info} name="Giờ thi" />,
            cell: ({ getValue }) => getValue().slice(0, 5),
            meta: { displayName: "Giờ thi" },
            size: 90,
        }),

        columnHelper.accessor((r) => r.exam_schedule.duration, {
            id: "duration",
            header: (info) => <DefaultHeader info={info} name="Thời lượng" />,
            cell: ({ getValue }) => `${getValue()} phút`,
            meta: { displayName: "Thời lượng" },
            size: 90,
        }),

        columnHelper.accessor((r) => r.exam_schedule.semester_subject.subject.code, {
            id: "subject_code",
            header: (info) => <DefaultHeader info={info} name="Mã môn" />,
            meta: { displayName: "Mã môn" },
            size: 120,
        }),

        columnHelper.accessor((r) => r.exam_schedule.semester_subject.subject.name, {
            id: "subject_name",
            header: (info) => <DefaultHeader info={info} name="Tên môn" />,
            meta: { displayName: "Tên môn" },
            size: 200,
        }),

        columnHelper.accessor((r) => r.room, {
            id: "room",
            header: (info) => <DefaultHeader info={info} name="Phòng" />,
            meta: { displayName: "Phòng" },
            size: 80,
        }),

        columnHelper.accessor((r) => r.class, {
            id: "class",
            header: (info) => <DefaultHeader info={info} name="Lớp" />,
            meta: { displayName: "Lớp" },
            size: 80,
        }),

        columnHelper.accessor((r) => `${r.start_seat} - ${r.end_seat}`, {
            id: "seat_range",
            header: (info) => <DefaultHeader info={info} name="Số ghế" />,
            meta: { displayName: "Số ghế" },
            size: 100,
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const assignment = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingExamRoom(assignment);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedExamRoom(assignment);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            meta: { displayName: "Tùy chọn" },
            size: 100,
        }),
    ];



    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách examRoom...
                </div>
            ) : (
                <>
                    <DataTable<ExamRoomData, any>
                        columns={columns}
                        data={Array.from(examRoomMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingExamRoom(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="examRoom"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingExamRoom && (
                        <FormModal
                            table="examRoom"
                            type="update"
                            data={editingExamRoom}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingExamRoom(null);
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
                            setSelectedExamRoom(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default ExamRoomPage;
