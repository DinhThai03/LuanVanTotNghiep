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
import { StudentData } from "@/types/StudentType";
import { getStudents } from "@/services/Student";

const columnHelper = createColumnHelper<StudentData>();

const StudentPage = () => {
    const [studentMap, setStudentMap] = useState<Map<number, StudentData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const res = await getStudents();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, StudentData>();
                    res.forEach((student: StudentData) => newMap.set(student.user_id, student));
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
    }, []);

    const handleAddSuccess = (student: StudentData) => {
        setStudentMap(prev => new Map(prev).set(student.user_id, student));
    };

    const handleUpdateSuccess = (student: StudentData) => {
        setStudentMap(prev => new Map(prev).set(student.user_id, student));
    };

    const handleDelete = async () => {
        if (!selectedStudent) return;
        try {
            // await deleteStudent(selectedStudent.code);
            // setStudentMap(prev => {
            //     const newMap = new Map(prev);
            //     newMap.delete(selectedStudent.user_id);
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
            setSelectedStudent(null);
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
            meta: {
                displayName: "▢",
            },
            size: 30,
        }),
        columnHelper.accessor((r) => `${r.code}`, {
            id: "code",
            header: (info) => <DefaultHeader info={info} name="Mã sinh viên" />,
            enableGlobalFilter: true,
            size: 120,
            meta: {
                displayName: "Mã sinh viên",
            },
        }),
        columnHelper.accessor((r) => `${r.user.last_name} ${r.user.first_name}`, {
            id: "full_name",
            header: (info) => <DefaultHeader info={info} name="Họ & Tên" />,
            enableGlobalFilter: true,
            size: 180,
            meta: {
                displayName: "Họ & Tên",
            },
        }),
        columnHelper.accessor((r) => r.user.username, {
            id: "username",
            header: (info) => <DefaultHeader info={info} name="Tên đăng nhập" />,
            enableGlobalFilter: true,
            size: 150,
            meta: {
                displayName: "Tên đăng nhập",
                hidden: true,
            },
        }),
        columnHelper.accessor((r) => r.user.email, {
            id: "email",
            header: (info) => <DefaultHeader info={info} name="Email" />,
            enableGlobalFilter: true,
            size: 250,
            meta: {
                displayName: "Email",
            },
        }),
        columnHelper.accessor(
            (r) => format(new Date(r.user.date_of_birth), "dd/MM/yyyy", { locale: vi }),
            {
                id: "date_of_birth",
                header: (info) => <DefaultHeader info={info} name="Ngày sinh" />,
                enableGlobalFilter: true,
                size: 110,
                meta: {
                    displayName: "Ngày sinh",
                },
            }
        ),
        columnHelper.accessor((r) => r.user.address, {
            id: "address",
            header: (info) => <DefaultHeader info={info} name="Địa chỉ" />,
            enableGlobalFilter: true,
            size: 250,
            meta: {
                displayName: "Địa chỉ",
            },
        }),
        columnHelper.accessor((r) => r.user.phone, {
            id: "phone",
            header: (info) => <DefaultHeader info={info} name="Số điện thoại" />,
            enableGlobalFilter: true,
            size: 120,
            meta: {
                displayName: "Số điện thoại",
            },
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
            meta: {
                displayName: "Trạng thái",
                hidden: true,
            },
        }),
        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const student = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingStudent(student);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedStudent(student);
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
            meta: {
                displayName: "Tùy chọn",
            },
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
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingStudent(null);
                        }}
                    />

                    {/* {showAddForm && (
                        <FormModal
                            table="student"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingStudent && (
                        <FormModal
                            table="student"
                            type="update"
                            data={editingStudent}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingStudent(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )} */}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa student “${selectedStudent?.user.first_name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedStudent(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default StudentPage;
