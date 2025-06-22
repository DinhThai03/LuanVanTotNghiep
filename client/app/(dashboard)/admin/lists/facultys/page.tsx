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
import { deleteFaculty, getFacultys } from "@/services/Faculty";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FacultysData } from "@/types/FacultyType";


const columnHelper = createColumnHelper<FacultysData>();

const FacultyPage = () => {
    const [facultyMap, setFacultyMap] = useState<Map<number, FacultysData>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<FacultysData | null>(null);
    const [editingFaculty, setEditingFaculty] = useState<FacultysData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchFacultys = async () => {
            try {
                setLoading(true);
                const res = await getFacultys();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, FacultysData>();
                    res.data.forEach((faculty: FacultysData) => newMap.set(faculty.id, faculty));
                    setFacultyMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách faculty:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách faculty.");
                }

                console.error("Lỗi khi lấy danh sách faculty:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFacultys();
    }, []);

    const handleAddSuccess = (faculty: FacultysData) => {
        setFacultyMap(prev => new Map(prev).set(faculty.id, faculty));
    };

    const handleUpdateSuccess = (faculty: FacultysData) => {
        setFacultyMap(prev => new Map(prev).set(faculty.id, faculty));
    };

    const handleDelete = async () => {
        if (!selectedFaculty) return;
        try {
            await deleteFaculty(selectedFaculty.id);
            setFacultyMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedFaculty.id);
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
            setSelectedFaculty(null);
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

        columnHelper.accessor("name", {
            id: "name",
            header: (info) => <DefaultHeader info={info} name="Tên Khoa" />,
            enableGlobalFilter: true,
            size: 300,
            meta: { displayName: "Tên Khoa" },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const faculty = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingFaculty(faculty);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedFaculty(faculty);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            enableGlobalFilter: false,
            size: 20,
            meta: { displayName: "Tùy chọn" },
        }),
    ];

    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách faculty...
                </div>
            ) : (
                <>
                    <DataTable<FacultysData, any>
                        columns={columns}
                        data={Array.from(facultyMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingFaculty(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="faculty"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingFaculty && (
                        <FormModal
                            table="faculty"
                            type="update"
                            data={editingFaculty}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingFaculty(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa niên khóa “${selectedFaculty?.name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedFaculty(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default FacultyPage;
