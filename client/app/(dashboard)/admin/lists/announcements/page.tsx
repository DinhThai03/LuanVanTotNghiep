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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AnnouncementData } from "@/types/AnnouncementType";
import { deleteAnnouncement, getAnnouncements } from "@/services/Announcement";


const columnHelper = createColumnHelper<AnnouncementData>();

const AnnouncementPage = () => {
    const [announcementMap, setAnnouncementMap] = useState<Map<number, AnnouncementData>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementData | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const res = await getAnnouncements();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, AnnouncementData>();
                    res.forEach((announcement: AnnouncementData) => newMap.set(announcement.id, announcement));
                    setAnnouncementMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách announcement:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách announcement.");
                }

                console.error("Lỗi khi lấy danh sách announcement:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleAddSuccess = (announcement: AnnouncementData) => {
        setAnnouncementMap(prev => new Map(prev).set(announcement.id, announcement));
    };

    const handleUpdateSuccess = (announcement: AnnouncementData) => {
        setAnnouncementMap(prev => new Map(prev).set(announcement.id, announcement));
    };

    const handleDelete = async () => {
        if (!selectedAnnouncement || loading) return;
        setLoading(true);

        try {
            await deleteAnnouncement(selectedAnnouncement.id);
            setAnnouncementMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedAnnouncement.id);
                return newMap;
            });
            toast.success("Xóa thành công");
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                JSON.stringify(err);

            toast.error("Xóa thất bại", {
                description: message,
            });
        } finally {
            setLoading(false);
            setShowConfirm(false);
            setSelectedAnnouncement(null);
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
            size: 30,
            meta: { displayName: "Chọn" },
        }),

        columnHelper.accessor("title", {
            id: "title",
            header: (info) => <DefaultHeader info={info} name="Tiêu đề" />,
            enableGlobalFilter: true,
            size: 200,
            meta: { displayName: "Tiêu đề" },
        }),

        columnHelper.accessor("content", {
            id: "content",
            header: (info) => <DefaultHeader info={info} name="Nội dung" />,
            enableGlobalFilter: true,
            size: 300,
            cell: ({ getValue }) => (
                <div className="line-clamp-2 text-sm text-gray-700">{getValue()}</div>
            ),
            meta: { displayName: "Nội dung" },
        }),

        columnHelper.accessor("date", {
            id: "date",
            header: (info) => <DefaultHeader info={info} name="Ngày thông báo" />,
            cell: ({ getValue }) => {
                const date = new Date(getValue());
                return format(date, "dd/MM/yyyy", { locale: vi });
            },
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Ngày thông báo" },
        }),

        columnHelper.accessor(
            (row) => {
                switch (row.target_type) {
                    case "all":
                        return "Tất cả đối tượng";
                    case "students":
                        return "Tất cả sinh viên";
                    case "teachers":
                        return "Tất cả giảng viên";
                    case "custom":
                        if (!row.classes || row.classes.length === 0) return "Không có lớp";
                        return row.classes.map((cls) => cls.name).join(", ");
                    default:
                        return "Không xác định";
                }
            },
            {
                id: "classes",
                header: (info) => <DefaultHeader info={info} name="Lớp áp dụng" />,
                enableGlobalFilter: true,
                size: 240,
                cell: ({ row }) => {
                    const { target_type, classes } = row.original;

                    switch (target_type) {
                        case "all":
                            return <span className="italic text-gray-500">Tất cả đối tượng</span>;
                        case "students":
                            return <span className="italic text-gray-500">Tất cả sinh viên</span>;
                        case "teachers":
                            return <span className="italic text-gray-500">Tất cả giảng viên</span>;
                        case "custom":
                            if (!classes || classes.length === 0) {
                                return <span className="italic text-gray-500">Không có lớp</span>;
                            }

                            return (
                                <ul className="list-none text-sm">
                                    {classes.map((cls, idx) => (
                                        <li key={idx}>{cls.name}</li>
                                    ))}
                                </ul>
                            );
                        default:
                            return <span className="italic text-red-500">Không xác định</span>;
                    }
                },
                meta: { displayName: "Đối tượng áp dụng" },
            }
        ),


        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const announcement = row.original;
                return (
                    <div className="flex text-lg gap-4">

                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingAnnouncement(announcement);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedAnnouncement(announcement);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            enableGlobalFilter: false,
            size: 90,
            meta: { displayName: "Tùy chọn" },
        }),
    ];


    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách announcement...
                </div>
            ) : (
                <>
                    <DataTable<AnnouncementData, any>
                        columns={columns}
                        data={Array.from(announcementMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingAnnouncement(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="announcement"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingAnnouncement && (
                        <FormModal
                            table="announcement"
                            type="update"
                            data={editingAnnouncement}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingAnnouncement(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa thông báo này không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedAnnouncement(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default AnnouncementPage;
