"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";

import { getAdmins, deleteAdmin, updateAdmin } from "@/services/Admins";
import { AdminData } from "@/types/AdminType";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import FormModal from "@/components/form/FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";

const columnHelper = createColumnHelper<AdminData>();

const AdminsPage = () => {
    const [adminMap, setAdminMap] = useState<Map<number, AdminData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<AdminData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setLoading(true);
                const res = await getAdmins();
                if (res) {
                    const newMap = new Map<number, AdminData>();
                    res.forEach((admin: AdminData) => newMap.set(admin.user_id, admin));
                    setAdminMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách admins:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách admins.");
                }

                console.error("Lỗi khi lấy danh sách admins:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    const handleAddSuccess = (admin: AdminData) => {
        setAdminMap(prev => new Map(prev).set(admin.user_id, admin));
    };

    const handleUpdateSuccess = (admin: AdminData) => {
        setAdminMap(prev => new Map(prev).set(admin.user_id, admin));
    };

    const handleDelete = async () => {
        if (!selectedAdmin) return;
        try {
            await deleteAdmin(selectedAdmin.user_id);
            setAdminMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedAdmin.user_id);
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
            setSelectedAdmin(null);
        }
    };

    const handleActive = async (admin: AdminData) => {
        const form = new FormData();
        form.append("is_active", admin.user.is_active ? "0" : "1");
        const res = await updateAdmin(admin.user_id, form);

        setAdminMap(prev => new Map(prev).set(admin.user_id, res.data.admin));
    }

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

        columnHelper.accessor((r) => `${r.user.last_name} ${r.user.first_name}`, {
            id: "full_name",
            header: (info) => <DefaultHeader info={info} name="Họ & Tên" />,
            meta: { displayName: "Họ & Tên" },
            enableGlobalFilter: true,
            size: 180,
        }),

        columnHelper.accessor((r) => r.user.username, {
            id: "username",
            header: (info) => <DefaultHeader info={info} name="Tên đăng nhập" />,
            meta: { displayName: "Tên đăng nhập" },
            size: 140,
        }),

        columnHelper.accessor((r) => r.user.email, {
            id: "email",
            header: (info) => <DefaultHeader info={info} name="Email" />,
            meta: { displayName: "Email" },
            size: 240,
        }),

        columnHelper.accessor(
            (r) => format(new Date(r.user.date_of_birth), "dd/MM/yyyy", { locale: vi }),
            {
                id: "date_of_birth",
                header: (info) => <DefaultHeader info={info} name="Ngày sinh" />,
                meta: { displayName: "Ngày sinh" },
                size: 110,
            }
        ),

        columnHelper.accessor((r) => r.user.phone, {
            id: "phone",
            header: (info) => <DefaultHeader info={info} name="SĐT" />,
            meta: { displayName: "Số điện thoại" },
            size: 120,
        }),

        columnHelper.accessor((r) => r.user.address, {
            id: "address",
            header: (info) => <DefaultHeader info={info} name="Địa chỉ" />,
            meta: {
                displayName: "Địa chỉ",
                hidden: true,
            },
            size: 200,
        }),

        columnHelper.accessor((r) => r.user.identity_number, {
            id: "identity_number",
            header: (info) => <DefaultHeader info={info} name="CCCD" />,
            meta: {
                displayName: "CCCD",
                hidden: true,
            },
            size: 140,
        }),

        columnHelper.accessor((r) => r.user.ethnicity, {
            id: "ethnicity",
            header: (info) => <DefaultHeader info={info} name="Dân tộc" />,
            meta: {
                displayName: "Dân tộc",
                hidden: true,
            },
            size: 100,
        }),

        columnHelper.accessor((r) => r.user.religion, {
            id: "religion",
            header: (info) => <DefaultHeader info={info} name="Tôn giáo" />,
            meta: {
                displayName: "Tôn giáo",
                hidden: true,
            },
            size: 100,
        }),

        columnHelper.display({
            id: "is_active",
            header: "Trạng thái",
            cell: ({ row }) => {
                const admin = row.original;
                const active = admin.user?.is_active;
                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={!!active}
                            onCheckedChange={async () => {
                                try {
                                    await handleActive(admin);
                                } catch (error) {
                                    toast.error("Cập nhật trạng thái thất bại");
                                }
                            }}
                            className={clsx(
                                "data-[state=checked]:bg-green-500",
                                "data-[state=unchecked]:bg-red-500",
                                "cursor-pointer"
                            )}
                        />
                        {/* <span className="text-sm">{active ? "Hoạt động" : "Đã khóa"}</span> */}
                    </div>
                );
            },
            enableGlobalFilter: true,
            size: 140,
            meta: { displayName: "Trạng thái tài khoản" },
        }),

        // columnHelper.accessor((r) => r.admin_level, {
        //     id: "admin_level",
        //     header: (info) => <DefaultHeader info={info} name="Cấp" />,
        //     cell: ({ getValue }) => (
        //         <span className="text-sm font-medium">
        //             {getValue() == 1 ? "Super Admin" : getValue() == 2 ? "Admin" : "Khác"}
        //         </span>
        //     ),
        //     meta: { displayName: "Cấp" },
        //     size: 90,
        // }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const admin = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button className="text-orange-500" onClick={() => {
                            setEditingAdmin(admin);
                            setShowUpdateForm(true);
                            setShowAddForm(false);
                        }}>
                            <FaRegPenToSquare />
                        </button>
                        <button className="text-red-500" onClick={() => {
                            setSelectedAdmin(admin);
                            setShowConfirm(true);
                        }}>
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            meta: { displayName: "Tùy chọn" },
            size: 90,
        }),
    ];

    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách admin...
                </div>
            ) : (
                <>
                    <DataTable<AdminData, any>
                        columns={columns}
                        data={Array.from(adminMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingAdmin(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="admin"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingAdmin && (
                        <FormModal
                            table="admin"
                            type="update"
                            data={editingAdmin}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingAdmin(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa admin “${selectedAdmin?.user.first_name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedAdmin(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default AdminsPage;
