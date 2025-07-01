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
import { deleteCohort, getCohorts } from "@/services/Cohort";
import { CohortData } from "@/types/CohortType";

const columnHelper = createColumnHelper<CohortData>();

const CohortPage = () => {
    const [cohortMap, setCohortMap] = useState<Map<number, CohortData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCohort, setSelectedCohort] = useState<CohortData | null>(null);
    const [editingCohort, setEditingCohort] = useState<CohortData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchCohorts = async () => {
            try {
                setLoading(true);
                const res = await getCohorts();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, CohortData>();
                    res.forEach((cohort: CohortData) => newMap.set(cohort.id, cohort));
                    setCohortMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách cohort:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách cohort.");
                }

                console.error("Lỗi khi lấy danh sách cohort:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCohorts();
    }, []);

    const handleAddSuccess = (cohort: CohortData) => {
        setCohortMap(prev => new Map(prev).set(cohort.id, cohort));
    };

    const handleUpdateSuccess = (cohort: CohortData) => {
        setCohortMap(prev => new Map(prev).set(cohort.id, cohort));
    };

    const handleDelete = async () => {
        if (!selectedCohort) return;
        try {
            await deleteCohort(selectedCohort.id);
            setCohortMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedCohort.id);
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
            setSelectedCohort(null);
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
            size: 30,
        }),

        columnHelper.accessor((r) => r.name, {
            id: "name",
            header: (info) => <DefaultHeader info={info} name="Niên khóa" />,
            enableGlobalFilter: true,
            size: 160,
            meta: { displayName: "Niên khóa" },
        }),

        columnHelper.accessor((r) => r.start_year, {
            id: "start_year",
            header: (info) => <DefaultHeader info={info} name="Năm bắt đầu" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Năm bắt đầu" },
        }),

        columnHelper.accessor((r) => r.end_year, {
            id: "end_year",
            header: (info) => <DefaultHeader info={info} name="Năm kết thúc" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Năm kết thúc" },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const cohort = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingCohort(cohort);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedCohort(cohort);
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
                    Đang tải danh sách cohort...
                </div>
            ) : (
                <>
                    <DataTable<CohortData, any>
                        columns={columns}
                        data={Array.from(cohortMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingCohort(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="cohort"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingCohort && (
                        <FormModal
                            table="cohort"
                            type="update"
                            data={editingCohort}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingCohort(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa niên khóa “${selectedCohort?.start_year} - ${selectedCohort?.end_year}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedCohort(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default CohortPage;
