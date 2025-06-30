"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { AxiosError } from "axios";
import FormModal from "@/components/form/FormModal";
import { ParentData } from "@/types/ParentType";
import { getParents } from "@/services/Parents";

const columnHelper = createColumnHelper<ParentData>();

const ParentPage = () => {
    const [parentMap, setParentMap] = useState<Map<number, ParentData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedParent, setSelectedParent] = useState<ParentData | null>(null);
    const [editingParent, setEditingParent] = useState<ParentData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                setLoading(true);
                const res = await getParents();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, ParentData>();
                    res.data.forEach((parent: ParentData) => newMap.set(parent.user_id, parent));
                    setParentMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách parent:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách parent.");
                }

                console.error("Lỗi khi lấy danh sách parent:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchParents();
    }, []);

    const handleAddSuccess = (parent: ParentData) => {
        setParentMap(prev => new Map(prev).set(parent.user_id, parent));
    };

    const handleUpdateSuccess = (parent: ParentData) => {
        setParentMap(prev => new Map(prev).set(parent.user_id, parent));
    };

    const handleDelete = async () => {
        if (!selectedParent) return;
        try {
            // await deleteParent(selectedParent.code);
            // setParentMap(prev => {
            //     const newMap = new Map(prev);
            //     newMap.delete(selectedParent.user_id);
            //     return newMap;
            // });
            // toast.success("Xóa thành công")
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
            setSelectedParent(null);
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
            meta: { displayName: "▢" },
            size: 30,
        }),

        // Mã sinh viên
        columnHelper.accessor((r) => r.student.code, {
            id: "code",
            header: (info) => <DefaultHeader info={info} name="Mã sinh viên" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Mã sinh viên" },
        }),

        // Họ và tên sinh viên
        columnHelper.accessor(
            (r) => `${r.student.user.last_name} ${r.student.user.first_name}`,
            {
                id: "student_full_name",
                header: (info) => <DefaultHeader info={info} name="Họ & Tên SV" />,
                enableGlobalFilter: true,
                size: 180,
                meta: { displayName: "Họ & Tên SV" },
            }
        ),

        // Họ và tên phụ huynh
        columnHelper.accessor(
            (r) => `${r.user.last_name} ${r.user.first_name}`,
            {
                id: "parent_full_name",
                header: (info) => <DefaultHeader info={info} name="Họ & Tên PH" />,
                enableGlobalFilter: true,
                size: 180,
                meta: { displayName: "Họ & Tên PH" },
            }
        ),

        columnHelper.accessor((r) => r.user.phone, {
            id: "parent_phone",
            header: (info) => <DefaultHeader info={info} name="SĐT phụ huynh" />,
            enableGlobalFilter: true,
            size: 140,
            meta: { displayName: "SĐT phụ huynh" },
        }),

        columnHelper.accessor((r) => r.user.email, {
            id: "parent_email",
            header: (info) => <DefaultHeader info={info} name="Email phụ huynh" />,
            enableGlobalFilter: true,
            size: 200,
            meta: { displayName: "Email phụ huynh" },
        }),

        columnHelper.accessor((r) => r.user.identity_number, {
            id: "identity_number",
            header: (info) => <DefaultHeader info={info} name="CCCD PH" />,
            enableGlobalFilter: false,
            size: 150,
            meta: { displayName: "CCCD PH", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.issued_date, {
            id: "issued_date",
            header: (info) => <DefaultHeader info={info} name="Ngày cấp CCCD" />,
            enableGlobalFilter: false,
            size: 130,
            meta: { displayName: "Ngày cấp CCCD", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.issued_place, {
            id: "issued_place",
            header: (info) => <DefaultHeader info={info} name="Nơi cấp CCCD" />,
            enableGlobalFilter: false,
            size: 150,
            meta: { displayName: "Nơi cấp CCCD", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.address, {
            id: "parent_address",
            header: (info) => <DefaultHeader info={info} name="Địa chỉ PH" />,
            enableGlobalFilter: false,
            size: 200,
            meta: { displayName: "Địa chỉ PH", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.sex ? "Nam" : "Nữ", {
            id: "parent_sex",
            header: (info) => <DefaultHeader info={info} name="Giới tính PH" />,
            enableGlobalFilter: false,
            size: 80,
            meta: { displayName: "Giới tính PH", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.ethnicity, {
            id: "ethnicity",
            header: (info) => <DefaultHeader info={info} name="Dân tộc" />,
            enableGlobalFilter: false,
            size: 100,
            meta: { displayName: "Dân tộc", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.religion, {
            id: "religion",
            header: (info) => <DefaultHeader info={info} name="Tôn giáo" />,
            enableGlobalFilter: false,
            size: 100,
            meta: { displayName: "Tôn giáo", hidden: true },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const parent = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingParent(parent);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
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
                    Đang tải danh sách parent...
                </div>
            ) : (
                <>
                    <DataTable<ParentData, any>
                        columns={columns}
                        data={Array.from(parentMap.values())}
                    />


                    {showUpdateForm && editingParent && (
                        <FormModal
                            table="parent"
                            type="update"
                            data={editingParent}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingParent(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa parent “${selectedParent?.user.first_name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedParent(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default ParentPage;
