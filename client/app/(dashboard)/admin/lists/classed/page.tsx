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
import { deleteClassed, getclasses } from "@/services/Classed";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ClassedData } from "@/types/ClassedType";


const columnHelper = createColumnHelper<ClassedData>();

const ClassedPage = () => {
    const [classedMap, setClassedMap] = useState<Map<number, ClassedData>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedClassed, setSelectedClassed] = useState<ClassedData | null>(null);
    const [editingClassed, setEditingClassed] = useState<ClassedData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchclasses = async () => {
            try {
                setLoading(true);
                const res = await getclasses();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, ClassedData>();
                    res.data.forEach((classed: ClassedData) => newMap.set(classed.id, classed));
                    setClassedMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách classed:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách classed.");
                }

                console.error("Lỗi khi lấy danh sách classed:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchclasses();
    }, []);

    const handleAddSuccess = (classed: ClassedData) => {
        setClassedMap(prev => new Map(prev).set(classed.id, classed));
    };

    const handleUpdateSuccess = (classed: ClassedData) => {
        setClassedMap(prev => new Map(prev).set(classed.id, classed));
    };

    const handleDelete = async () => {
        if (!selectedClassed) return;
        try {
            await deleteClassed(selectedClassed.id);
            setClassedMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedClassed.id);
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
            setSelectedClassed(null);
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
            header: (info) => <DefaultHeader info={info} name="Tên lớp" />,
            enableGlobalFilter: true,
            size: 250,
            meta: { displayName: "Tên lớp" },
        }),

        columnHelper.accessor("student_count", {
            id: "student_count",
            header: (info) => <DefaultHeader info={info} name="Sĩ số" />,
            enableGlobalFilter: true,
            size: 100,
            meta: { displayName: "Sĩ số" },
        }),

        columnHelper.accessor("faculty.name", {
            id: "faculty_name",
            header: (info) => <DefaultHeader info={info} name="Khoa" />,
            enableGlobalFilter: true,
            size: 200,
            meta: { displayName: "Khoa" },
        }),

        columnHelper.accessor("cohort.name", {
            id: "cohort_name",
            header: (info) => <DefaultHeader info={info} name="Niên khóa" />,
            enableGlobalFilter: true,
            size: 200,
            meta: { displayName: "Niên khóa" },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const classed = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingClassed(classed);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedClassed(classed);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            enableGlobalFilter: false,
            size: 40,
            meta: { displayName: "Tùy chọn" },
        }),
    ];


    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách classed...
                </div>
            ) : (
                <>
                    <DataTable<ClassedData, any>
                        columns={columns}
                        data={Array.from(classedMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingClassed(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="classed"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingClassed && (
                        <FormModal
                            table="classed"
                            type="update"
                            data={editingClassed}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingClassed(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa phòng “${selectedClassed?.name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedClassed(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default ClassedPage;
