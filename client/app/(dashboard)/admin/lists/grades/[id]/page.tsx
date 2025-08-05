"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { FaRegPenToSquare } from "react-icons/fa6";

import { GradeData } from "@/types/GradeType";
import { getGradeByLesson } from "@/services/Grade";

import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import FormModal from "@/components/form/FormModal";
import { toast } from "sonner";
import { updateLesson } from "@/services/Lesson";

const columnHelper = createColumnHelper<GradeData>();

export default function LessonGradesPage() {
    const { id } = useParams();
    const [status, setStatus] = useState<string | null>(null);
    const [grades, setGrades] = useState<GradeData[]>([]);
    const [editingGrade, setEditingGrade] = useState<GradeData | null>(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await getGradeByLesson(Number(id));
                setGrades(res.data);
                setStatus(res.grade_status);
            } catch (error: any) {
                console.error("Failed to fetch grades:", error);
                toast.error("Không thể tải danh sách điểm");
            }
        };

        fetchGrades();
    }, [id]);

    const handleUpdateSuccess = (updatedGrade: GradeData) => {
        setGrades((prev) =>
            prev.map((g) =>
                g.registration_id === updatedGrade.registration_id ? updatedGrade : g
            )
        );
    };

    const columns = [
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        columnHelper.accessor((r) => r.registration.student.code, {
            id: "student_code",
            header: (info) => <DefaultHeader info={info} name="Mã SV" />,
            size: 100,
        }),
        columnHelper.accessor(
            (r) => `${r.registration.student.user.last_name} ${r.registration.student.user.first_name}`,
            {
                id: "student_name",
                header: (info) => <DefaultHeader info={info} name="Họ tên" />,
                size: 160,
            }
        ),
        columnHelper.accessor((r) => r.process_score, {
            id: "process_score",
            header: (info) => <DefaultHeader info={info} name="Điểm QT" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.midterm_score, {
            id: "midterm_score",
            header: (info) => <DefaultHeader info={info} name="Điểm GK" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.final_score, {
            id: "final_score",
            header: (info) => <DefaultHeader info={info} name="Điểm CK" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.average_score, {
            id: "average_score",
            header: (info) => <DefaultHeader info={info} name="Điểm TB" />,
            size: 80,
        }),
        columnHelper.accessor((r) => r.letter_grade, {
            id: "letter_grade",
            header: (info) => <DefaultHeader info={info} name="Điểm chữ" />,
            size: 90,
        }),
        columnHelper.accessor((r) => r.result, {
            id: "result",
            header: (info) => <DefaultHeader info={info} name="Kết quả" />,
            cell: ({ getValue }) => {
                const result = getValue();
                return (
                    <span className={`px-2 py-1 rounded text-white text-sm font-medium ${result ? result == 1 ? "bg-green-500" : "bg-red-500" : ""}`}>
                        {result == 1 ? "Đạt" : result == 0 ? "Không đạt" : ""}
                    </span>
                );
            },
            size: 100,
        }),
        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const grade = row.original;
                return (
                    <button
                        className="text-orange-500 text-lg"
                        onClick={() => {
                            setEditingGrade(grade);
                            setShowUpdateForm(true);
                        }}
                    >
                        <FaRegPenToSquare />
                    </button>
                );
            },
            size: 100,
        }),
    ];

    const handleApproveGrades = async () => {
        try {
            const form = new FormData();
            form.append("grade_status", "submitted");
            const res = await updateLesson(Number(id), form);
            toast.success("Đã xét duyệt điểm thành công");
            window.location.reload();
        } catch (error) {
            console.error("Error approving grades:", error);
            toast.error("Không thể xét duyệt điểm");
        }
    }

    return (
        <div className="p-4 w-full bg-white shadow rounded">
            <div className='flex items-center justify-between mb-4'>
                <h2 className="text-xl font-bold">Danh sách điểm</h2>

                {status === "pending" && (
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleApproveGrades()}
                    >
                        xét duyệt
                    </button>
                )}

            </div>
            <DataTable<GradeData, any> columns={columns} data={grades} className="h-[calc(100vh-150px)]" />

            {showUpdateForm && editingGrade && (
                <FormModal
                    table="grade"
                    type="update"
                    data={editingGrade}
                    onClose={() => {
                        setShowUpdateForm(false);
                        setEditingGrade(null);
                    }}
                    onSubmitSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
}
