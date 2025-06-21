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
import FormModal from "@/components/form/FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { deleteAcademicYear, getAcademicYears } from "@/services/AcademicYear";
import { AcademicYearData } from "@/types/AcademicYearType";

const columnHelper = createColumnHelper<AcademicYearData>();

const AcademicYearPage = () => {
    const [academic_yearMap, setAcademicYearMap] = useState<Map<number, AcademicYearData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYearData | null>(null);
    const [editingAcademicYear, setEditingAcademicYear] = useState<AcademicYearData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                setLoading(true);
                const res = await getAcademicYears();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, AcademicYearData>();
                    res.data.forEach((academic_year: AcademicYearData) => newMap.set(academic_year.id, academic_year));
                    setAcademicYearMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách academic_year:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách academic_year.");
                }

                console.error("Lỗi khi lấy danh sách academic_year:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAcademicYears();
    }, []);

    const handleAddSuccess = (academic_year: AcademicYearData) => {
        setAcademicYearMap(prev => new Map(prev).set(academic_year.id, academic_year));
    };

    const handleUpdateSuccess = (academic_year: AcademicYearData) => {
        setAcademicYearMap(prev => new Map(prev).set(academic_year.id, academic_year));
    };

    const handleDelete = async () => {
        if (!selectedAcademicYear) return;
        try {
            await deleteAcademicYear(selectedAcademicYear.id);
            setAcademicYearMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedAcademicYear.id);
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
            setSelectedAcademicYear(null);
        }
    };

    const columns = [
        // checkbox chọn hàng
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
            size: 30,
        }),

        // tên / mã niên khóa
        columnHelper.accessor((r) => r.name, {
            id: "name",
            header: (info) => <DefaultHeader info={info} name="Niên khóa" />,
            enableGlobalFilter: true,
            size: 160,
            meta: { displayName: "Niên khóa" },
        }),

        // năm bắt đầu
        columnHelper.accessor((r) => r.start_year, {
            id: "start_year",
            header: (info) => <DefaultHeader info={info} name="Năm bắt đầu" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Năm bắt đầu" },
        }),

        // năm kết thúc
        columnHelper.accessor((r) => r.end_year, {
            id: "end_year",
            header: (info) => <DefaultHeader info={info} name="Năm kết thúc" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Năm kết thúc" },
        }),

        // cột thao tác
        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const academic_year = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingAcademicYear(academic_year);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedAcademicYear(academic_year);
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
            meta: { displayName: "Tùy chọn" },
        }),
    ];


    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách academic_year...
                </div>
            ) : (
                <>
                    <DataTable<AcademicYearData, any>
                        columns={columns}
                        data={Array.from(academic_yearMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingAcademicYear(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="academic_year"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingAcademicYear && (
                        <FormModal
                            table="academic_year"
                            type="update"
                            data={editingAcademicYear}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingAcademicYear(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa niên khóa “${selectedAcademicYear?.name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedAcademicYear(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default AcademicYearPage;
