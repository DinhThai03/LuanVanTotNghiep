"use client";

import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { SubjectData } from "@/types/SubjectType";
import { deleteSubject, getSubjects } from "@/services/Subject";
import FormModal from "@/components/form/FormModal";
// import { deleteSubject } from "@/services/Subject"; // nếu có API delete

const columnHelper = createColumnHelper<SubjectData>();

const SubjectPage = () => {
    const [subjectMap, setSubjectMap] = useState<Map<number, SubjectData>>(new Map());
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
    const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const res = await getSubjects();
                if (res) {
                    const newMap = new Map<number, SubjectData>();
                    res.data.forEach((subject: SubjectData) => newMap.set(subject.id, subject));
                    setSubjectMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message =
                    axiosErr.response?.data?.message ||
                    axiosErr.response?.data?.error ||
                    (axiosErr.message === "Network Error"
                        ? "Không thể kết nối đến server."
                        : "Đã có lỗi xảy ra khi lấy danh sách subject.");

                toast.error(message, { description: "Vui lòng kiểm tra lại" });
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const handleAddSuccess = (subject: SubjectData) => {
        setSubjectMap((prev) => new Map(prev).set(subject.id, subject));
    };

    const handleUpdateSuccess = (subject: SubjectData) => {
        setSubjectMap((prev) => new Map(prev).set(subject.id, subject));
    };

    const handleDelete = async () => {
        if (!selectedSubject) return;
        try {
            await deleteSubject(selectedSubject.id);
            setSubjectMap((prev) => {
                const newMap = new Map(prev);
                newMap.delete(selectedSubject.id);
                return newMap;
            });
            toast.success("Xóa thành công");
        } catch (err: any) {
            const message =
                err?.response?.data?.message || err?.message || JSON.stringify(err);
            toast.error("Xóa thất bại", { description: "Môn học đang được tổ chức, không thể xóa" });
        } finally {
            setShowConfirm(false);
            setSelectedSubject(null);
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
            meta: {
                displayName: "▢",
            },
        }),
        columnHelper.accessor("name", {
            id: "name",
            header: (info) => <DefaultHeader info={info} name="Tên học phần" />,
            enableGlobalFilter: true,
            size: 200,
            meta: {
                displayName: "Tên học phần",
            },
        }),
        columnHelper.accessor((r) => r.credit, {
            id: "credit",
            header: (info) => <DefaultHeader info={info} name="Tín chỉ" />,
            enableGlobalFilter: true,
            size: 100,
            meta: {
                displayName: "Tín chỉ",
            },
        }),
        columnHelper.accessor("tuition_credit", {
            id: "tuition_credit",
            header: (info) => <DefaultHeader info={info} name="Tín chỉ học phí" />,
            enableGlobalFilter: true,
            size: 120,
            meta: {
                displayName: "Tín chỉ học phí",
            },
        }),
        columnHelper.accessor("process_percent", {
            id: "process_percent",
            header: (info) => <DefaultHeader info={info} name="% Quá trình" />,
            enableGlobalFilter: false,
            size: 120,
            meta: {
                displayName: "% Quá trình",
            },
        }),
        columnHelper.accessor("midterm_percent", {
            id: "midterm_percent",
            header: (info) => <DefaultHeader info={info} name="% Giữa kỳ" />,
            enableGlobalFilter: false,
            size: 120,
            meta: {
                displayName: "% Giữa kỳ",
            },
        }),
        columnHelper.accessor("final_percent", {
            id: "final_percent",
            header: (info) => <DefaultHeader info={info} name="% Cuối kỳ" />,
            enableGlobalFilter: false,
            size: 120,
            meta: {
                displayName: "% Cuối kỳ",
            },
        }),
        columnHelper.accessor("year", {
            id: "year",
            header: (info) => <DefaultHeader info={info} name="Năm học" />,
            enableGlobalFilter: true,
            size: 100,
            meta: {
                displayName: "Năm học",
            },
        }),
        columnHelper.accessor(
            (row) =>
                row.faculty_subjects?.map((fs: any) => fs.faculty?.name).join(", ") ?? "",
            {
                id: "faculty_subjects",
                header: (info) => <DefaultHeader info={info} name="Khoa liên quan" />,
                cell: ({ row }) => {
                    const facultyNames = row.original.faculty_subjects
                        ?.map((fs: any) => fs.faculty?.name)
                        .filter(Boolean);
                    return (
                        <ul className="list-inside space-y-1">
                            {facultyNames.map((name: string, idx: number) => (
                                <li key={idx}>{name}</li>
                            ))}
                        </ul>
                    );
                },
                enableGlobalFilter: true,
                size: 180,
                meta: {
                    displayName: "Khoa liên quan",
                },
            }
        ),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const subject = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingSubject(subject);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedSubject(subject);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            size: 90,
            meta: {
                displayName: "Tùy chọn",
            },
        }),
    ];


    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách học phần...
                </div>
            ) : (
                <>
                    <DataTable<SubjectData, any>
                        columns={columns}
                        data={Array.from(subjectMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingSubject(null);
                        }}
                    />

                    {showAddForm &&
                        <FormModal
                            table="subject"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    }
                    {showUpdateForm &&
                        <FormModal
                            table="subject"
                            type="update"
                            data={editingSubject}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingSubject(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    }


                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa học phần “${selectedSubject?.name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedSubject(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default SubjectPage;
