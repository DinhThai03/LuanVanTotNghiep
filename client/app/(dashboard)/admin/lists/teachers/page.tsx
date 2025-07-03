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
import { deleteTeacher, getTeachers } from "@/services/Teacher";
import { TeacherData } from "@/types/TeacherType";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { TeacherSubjectData } from "@/types/TeacherSubjectType";
import Link from "next/link";
import { TbScanEye } from "react-icons/tb";

const columnHelper = createColumnHelper<TeacherData>();

const TeacherPage = () => {
    const [teacherMap, setTeacherMap] = useState<Map<number, TeacherData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null);
    const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const res = await getTeachers();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, TeacherData>();
                    res.data.forEach((teacher: TeacherData) => newMap.set(teacher.user_id, teacher));
                    setTeacherMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách teacher:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách teacher.");
                }

                console.error("Lỗi khi lấy danh sách teacher:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const handleAddSuccess = (teacher: TeacherData) => {
        setTeacherMap(prev => new Map(prev).set(teacher.user_id, teacher));
    };

    const handleUpdateSuccess = (teacher: TeacherData) => {
        setTeacherMap(prev => new Map(prev).set(teacher.user_id, teacher));
    };

    const handleDelete = async () => {
        if (!selectedTeacher) return;
        try {
            await deleteTeacher(selectedTeacher.code);
            setTeacherMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedTeacher.user_id);
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
            setSelectedTeacher(null);
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
            meta: { displayName: "Chọn" },
        }),

        columnHelper.accessor((r) => r.code, {
            id: "code",
            header: (info) => <DefaultHeader info={info} name="Mã GV" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Mã giảng viên" },
        }),

        columnHelper.accessor((r) => `${r.user.last_name} ${r.user.first_name}`, {
            id: "full_name",
            header: (info) => <DefaultHeader info={info} name="Họ & Tên" />,
            enableGlobalFilter: true,
            size: 180,
            meta: { displayName: "Họ và tên" },
        }),

        columnHelper.accessor((r) => r.status, {
            id: "status",
            header: (info) => <DefaultHeader info={info} name="Tình trạng" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Tình trạng công tác" },
        }),

        columnHelper.accessor((r) => r.user.sex ? "Nam" : "Nữ", {
            id: "sex",
            header: (info) => <DefaultHeader info={info} name="Giới tính" />,
            enableGlobalFilter: true,
            size: 80,
            meta: { displayName: "Giới tính", hidden: true },
        }),

        columnHelper.accessor((r) => format(new Date(r.user.date_of_birth), "dd/MM/yyyy", { locale: vi }), {
            id: "date_of_birth",
            header: (info) => <DefaultHeader info={info} name="Ngày sinh" />,
            enableGlobalFilter: true,
            size: 110,
            meta: { displayName: "Ngày sinh" },
        }),

        columnHelper.accessor((r) => r.user.email, {
            id: "email",
            header: (info) => <DefaultHeader info={info} name="Email" />,
            enableGlobalFilter: true,
            size: 250,
            meta: { displayName: "Email" },
        }),

        columnHelper.accessor((r) => r.user.phone, {
            id: "phone",
            header: (info) => <DefaultHeader info={info} name="SĐT" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Số điện thoại" },
        }),

        columnHelper.accessor((r) => r.user.address, {
            id: "address",
            header: (info) => <DefaultHeader info={info} name="Địa chỉ" />,
            enableGlobalFilter: true,
            size: 250,
            meta: { displayName: "Địa chỉ", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.username, {
            id: "username",
            header: (info) => <DefaultHeader info={info} name="Tên đăng nhập" />,
            enableGlobalFilter: true,
            size: 150,
            meta: { displayName: "Tên đăng nhập", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.identity_number, {
            id: "identity_number",
            header: (info) => <DefaultHeader info={info} name="CCCD" />,
            enableGlobalFilter: true,
            size: 140,
            meta: { displayName: "CMND/CCCD", hidden: true },
        }),

        columnHelper.accessor((r) => format(new Date(r.user.issued_date!), "dd/MM/yyyy", { locale: vi }), {
            id: "issued_date",
            header: (info) => <DefaultHeader info={info} name="Ngày cấp" />,
            enableGlobalFilter: true,
            size: 110,
            meta: { displayName: "Ngày cấp", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.issued_place, {
            id: "issued_place",
            header: (info) => <DefaultHeader info={info} name="Nơi cấp" />,
            enableGlobalFilter: true,
            size: 150,
            meta: { displayName: "Nơi cấp", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.ethnicity, {
            id: "ethnicity",
            header: (info) => <DefaultHeader info={info} name="Dân tộc" />,
            enableGlobalFilter: true,
            size: 100,
            meta: { displayName: "Dân tộc", hidden: true },
        }),

        columnHelper.accessor((r) => r.user.religion, {
            id: "religion",
            header: (info) => <DefaultHeader info={info} name="Tôn giáo" />,
            enableGlobalFilter: true,
            size: 100,
            meta: { displayName: "Tôn giáo", hidden: true },
        }),

        columnHelper.accessor(
            (row) =>
                row.teacher_subjects?.map((ts: TeacherSubjectData) => ts.subject?.name).join(", ") ?? "",
            {
                id: "teacher_subjects",
                header: (info) => <DefaultHeader info={info} name="Môn dạy" />,
                cell: ({ row }) => {
                    const subjectNames = row.original.teacher_subjects
                        ?.map((ts: TeacherSubjectData) => ts.subject?.name)
                        .filter(Boolean);
                    return (
                        <ul className="list-inside space-y-1">
                            {subjectNames.map((name: string, idx: number) => (
                                <li key={idx}>{name}</li>
                            ))}
                        </ul>
                    );
                },
                enableGlobalFilter: true,
                size: 200,
                meta: {
                    displayName: "Môn giảng dạy",
                    hidden: true,
                },
            }
        ),

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
            enableGlobalFilter: true,
            size: 100,
            meta: { displayName: "Trạng thái tài khoản" },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const teacher = row.original;
                return (
                    <div className="flex text-lg gap-4">

                        <Link
                            href={`/admin/lists/teachers/${teacher.user_id}`}
                            className="text-gray-500"
                        >
                            <TbScanEye />
                        </Link>
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingTeacher(teacher);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedTeacher(teacher);
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
                    Đang tải danh sách teacher...
                </div>
            ) : (
                <>
                    <DataTable<TeacherData, any>
                        columns={columns}
                        data={Array.from(teacherMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingTeacher(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="teacher"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingTeacher && (
                        <FormModal
                            table="teacher"
                            type="update"
                            data={editingTeacher}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingTeacher(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa teacher “${selectedTeacher?.user.first_name}” không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedTeacher(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default TeacherPage;
