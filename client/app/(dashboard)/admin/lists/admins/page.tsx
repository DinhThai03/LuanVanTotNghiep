"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";

import { getAdmins, deleteAdmin } from "@/services/Admins";
import { AdminData } from "@/types/AdminType";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import FormModal from "@/components/form/FormModal";

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
                console.error("Lỗi khi lấy danh sách admins:", err);
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
        } catch (err) {
            console.error("Xóa thất bại:", err);
        } finally {
            setShowConfirm(false);
            setSelectedAdmin(null);
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
            size: 30,
        }),
        columnHelper.accessor(
            (r) => `${r.user.last_name} ${r.user.first_name}`,
            {
                id: "full_name",
                header: (info) => <DefaultHeader info={info} name="Họ & Tên" />,
                enableGlobalFilter: true,
                size: 200,
            }
        ),
        columnHelper.accessor((r) => r.user.username, {
            id: "username",
            header: (info) => <DefaultHeader info={info} name="Tên đăng nhập" />,
            enableGlobalFilter: true,
            size: 150,
        }),
        columnHelper.accessor((r) => r.user.email, {
            id: "email",
            header: (info) => <DefaultHeader info={info} name="Email" />,
            enableGlobalFilter: true,
            size: 250,
        }),
        columnHelper.accessor(
            (r) => format(new Date(r.user.date_of_birth), "dd/MM/yyyy", { locale: vi }),
            {
                id: "date_of_birth",
                header: (info) => <DefaultHeader info={info} name="Ngày sinh" />,
                enableGlobalFilter: true,
                size: 110,
            }
        ),
        columnHelper.accessor((r) => r.user.address, {
            id: "address",
            header: (info) => <DefaultHeader info={info} name="Địa chỉ" />,
            enableGlobalFilter: true,
            size: 250,
        }),
        columnHelper.accessor((r) => r.user.phone, {
            id: "phone",
            header: (info) => <DefaultHeader info={info} name="Số điện thoại" />,
            enableGlobalFilter: true,
            size: 120,
        }),
        columnHelper.accessor((r) => r.user.is_active, {
            id: "is_active",
            header: (info) => <DefaultHeader info={info} name="Trạng thái" />,
            cell: ({ getValue }) => {
                const active = getValue();
                return (
                    <span className={`px-2 py-1 rounded text-white text-sm font-medium w-fit ${active ? "bg-green-500" : "bg-red-500"}`}>
                        {active ? "Hoạt động" : "Đã khóa"}
                    </span>
                );
            },
            enableGlobalFilter: false,
            size: 100,
        }),
        columnHelper.accessor((r) => r.admin_level, {
            id: "admin_level",
            header: (info) => <DefaultHeader info={info} name="Cấp" />,
            cell: ({ getValue }) =>
                <span className="text-sm font-medium">
                    {getValue() == 1 ? "Super Admin" : getValue() == 2 ? "Admin" : "Khác"}
                </span>,
            enableGlobalFilter: false,
            size: 90,
        }),
        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const admin = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingAdmin(admin);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedAdmin(admin);
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
