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
import { deleteRoom, getRooms } from "@/services/Room";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { RoomData } from "@/types/RoomType";


const columnHelper = createColumnHelper<RoomData>();

const RoomPage = () => {
    const [roomMap, setRoomMap] = useState<Map<number, RoomData>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
    const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const res = await getRooms();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, RoomData>();
                    res.data.forEach((room: RoomData) => newMap.set(room.id, room));
                    setRoomMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách room:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách room.");
                }

                console.error("Lỗi khi lấy danh sách room:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleAddSuccess = (room: RoomData) => {
        setRoomMap(prev => new Map(prev).set(room.id, room));
    };

    const handleUpdateSuccess = (room: RoomData) => {
        setRoomMap(prev => new Map(prev).set(room.id, room));
    };

    const handleDelete = async () => {
        if (!selectedRoom) return;
        try {
            await deleteRoom(selectedRoom.id);
            setRoomMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedRoom.id);
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
            setSelectedRoom(null);
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

        columnHelper.accessor("name", {
            id: "name",
            header: (info) => <DefaultHeader info={info} name="Tên phòng" />,
            enableGlobalFilter: true,
            size: 500,
            meta: { displayName: "Tên phòng" },
        }),

        columnHelper.accessor("size", {
            id: "size",
            header: (info) => <DefaultHeader info={info} name="Sức chứa" />,
            enableGlobalFilter: true,
            size: 150,
            meta: { displayName: "Sức chứa" },
        }),

        columnHelper.accessor("room_type", {
            id: "room_type",
            header: (info) => <DefaultHeader info={info} name="Loại phòng" />,
            cell: ({ getValue }) => getValue() == "LT" ? "Lý thuyết" : "Thực hành",
            enableGlobalFilter: true,
            size: 150,
            meta: { displayName: "Loại phòng" },
        }),

        columnHelper.accessor("is_active", {
            id: "is_active",
            header: "Trạng thái",
            cell: ({ getValue }) => getValue() ? "Hoạt động" : "Không hoạt động",
            enableGlobalFilter: true,
            size: 100,
            meta: { displayName: "Trạng thái" },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const room = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingRoom(room);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedRoom(room);
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
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách room...
                </div>
            ) : (
                <>
                    <DataTable<RoomData, any>
                        columns={columns}
                        data={Array.from(roomMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingRoom(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="room"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingRoom && (
                        <FormModal
                            table="room"
                            type="update"
                            data={editingRoom}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingRoom(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa phòng “${selectedRoom?.name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedRoom(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default RoomPage;
