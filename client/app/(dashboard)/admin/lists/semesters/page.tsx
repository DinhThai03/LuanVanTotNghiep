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
import { SemesterData } from "@/types/SemesterType";
import { deleteSemester, getSemesters } from "@/services/Semesters";
import { format } from "date-fns";
import { vi } from "date-fns/locale";


const columnHelper = createColumnHelper<SemesterData>();

const SemesterPage = () => {
    const [semesterMap, setSemesterMap] = useState<Map<number, SemesterData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<SemesterData | null>(null);
    const [editingSemester, setEditingSemester] = useState<SemesterData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                setLoading(true);
                const res = await getSemesters();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, SemesterData>();
                    res.data.forEach((semester: SemesterData) => newMap.set(semester.id, semester));
                    setSemesterMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách semester:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách semester.");
                }

                console.error("Lỗi khi lấy danh sách semester:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSemesters();
    }, []);

    const handleAddSuccess = (semester: SemesterData) => {
        setSemesterMap(prev => new Map(prev).set(semester.id, semester));
    };

    const handleUpdateSuccess = (semester: SemesterData) => {
        setSemesterMap(prev => new Map(prev).set(semester.id, semester));
    };

    const handleDelete = async () => {
        if (!selectedSemester) return;
        try {
            await deleteSemester(selectedSemester.id);
            setSemesterMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedSemester.id);
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
            setSelectedSemester(null);
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

        columnHelper.accessor("name", {
            id: "name",
            header: (info) => <DefaultHeader info={info} name="Tên học kỳ" />,
            enableGlobalFilter: true,
            size: 160,
            meta: { displayName: "Tên học kỳ" },
        }),

        columnHelper.accessor(
            (r) => format(new Date(r.start_date), "dd/MM/yyyy", { locale: vi }),
            {
                id: "start_date",
                header: (info) => <DefaultHeader info={info} name="Ngày bắt đầu" />,
                meta: {
                    displayName: "Ngày bắt đầu",
                },
                enableGlobalFilter: true,
                size: 120,
            }
        ),

        columnHelper.accessor(
            (r) => format(new Date(r.end_date), "dd/MM/yyyy", { locale: vi }),
            {
                id: "end_date",
                header: (info) => <DefaultHeader info={info} name="Ngày kết thúc" />,
                meta: {
                    displayName: "Ngày kết thúc",
                },
                enableGlobalFilter: true,
                size: 120,
            }
        ),

        columnHelper.accessor((r) => `${r.academic_year.start_year} - ${r.academic_year.end_year}`, {
            id: "academic_year",
            header: (info) => <DefaultHeader info={info} name="Năm học" />,
            enableGlobalFilter: true,
            size: 140,
            meta: { displayName: "Năm học" },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const semester = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingSemester(semester);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedSemester(semester);
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
                    Đang tải danh sách semester...
                </div>
            ) : (
                <>
                    <DataTable<SemesterData, any>
                        columns={columns}
                        data={Array.from(semesterMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingSemester(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="semester"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingSemester && (
                        <FormModal
                            table="semester"
                            type="update"
                            data={editingSemester}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingSemester(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa niên khóa “${selectedSemester?.name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedSemester(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default SemesterPage;
