"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { StudentData } from "@/types/StudentType";
import { getStudentsByLesson } from "@/services/Registration";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { DataTable } from "@/components/ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

const columnHelper = createColumnHelper<StudentData>();


const StudentsByLessonPage = () => {
    const { id } = useParams();
    const [studentMap, setStudentMap] = useState<Map<number, StudentData>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await getStudentsByLesson(Number(id));
                if (res) {
                    const newMap = new Map<number, StudentData>();
                    res.students.forEach((student: StudentData) => newMap.set(student.user_id, student));
                    setStudentMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách student:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách student.");
                }

                console.error("Lỗi khi lấy danh sách student:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [id]);

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
        columnHelper.accessor((r) => r.code, {
            id: "code",
            header: (info) => <DefaultHeader info={info} name="Mã sinh viên" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Mã sinh viên" },
        }),
        columnHelper.accessor((r) => `${r.user.last_name} ${r.user.first_name}`, {
            id: "full_name",
            header: (info) => <DefaultHeader info={info} name="Họ & Tên" />,
            enableGlobalFilter: true,
            size: 180,
            meta: { displayName: "Họ & Tên" },
        }),
        columnHelper.accessor((r) => r.user.sex ? "Nam" : "Nữ", {
            id: "sex",
            header: (info) => <DefaultHeader info={info} name="Giới tính" />,
            enableGlobalFilter: false,
            size: 80,
            meta: { displayName: "Giới tính" },
        }),

        columnHelper.accessor((r) => r.user.email, {
            id: "email",
            header: (info) => <DefaultHeader info={info} name="Email" />,
            enableGlobalFilter: true,
            size: 250,
            meta: { displayName: "Email" },
        }),
        columnHelper.accessor(
            (r) => format(new Date(r.user.date_of_birth), "dd/MM/yyyy", { locale: vi }),
            {
                id: "date_of_birth",
                header: (info) => <DefaultHeader info={info} name="Ngày sinh" />,
                enableGlobalFilter: true,
                size: 110,
                meta: { displayName: "Ngày sinh" },
            }
        ),

        columnHelper.accessor((r) => r.user.address, {
            id: "address",
            header: (info) => <DefaultHeader info={info} name="Địa chỉ" />,
            enableGlobalFilter: true,
            size: 250,
            meta: { displayName: "Địa chỉ" },
        }),
        columnHelper.accessor((r) => r.user.phone, {
            id: "phone",
            header: (info) => <DefaultHeader info={info} name="Số điện thoại" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Số điện thoại" },
        }),
    ];


    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách student...
                </div>
            ) : (
                <>
                    <DataTable<StudentData, any>
                        columns={columns}
                        data={Array.from(studentMap.values())}
                    />
                </>
            )}
        </div>
    );
};

export default StudentsByLessonPage;
