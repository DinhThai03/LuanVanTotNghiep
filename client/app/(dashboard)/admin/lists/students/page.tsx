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
import { deleteStudent, getStudents, importStudent, updateStudent } from "@/services/Student";
import FormModal from "@/components/form/FormModal";
import Link from "next/link";
import { TbScanEye } from "react-icons/tb";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";

const columnHelper = createColumnHelper<StudentData>();

const StudentPage = () => {
    const [studentMap, setStudentMap] = useState<Map<number, StudentData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);

    const [showImportForm, setShowImportForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [importErrors, setImportErrors] = useState<any[] | null>(null);


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
        // console.log(student);
        // setStudentMap(prev => new Map(prev).set(student.user_id, student));
    };

    const handleUpdateSuccess = (student: StudentData) => {
        setStudentMap(prev => new Map(prev).set(student.user_id, student));
    };

    const handleDelete = async () => {
        if (!selectedStudent) return;
        try {
            await deleteStudent(selectedStudent.code);
            setStudentMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedStudent.user_id);
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
            setSelectedStudent(null);
        }
    };

    const handleActive = async (sutdent: StudentData) => {
        const form = new FormData();
        form.append("is_active", sutdent.user.is_active ? "0" : "1");
        const res = await updateStudent(sutdent.code, form);

        setStudentMap(prev => new Map(prev).set(sutdent.user_id, res.data.data));
    }

    const handleUpload = async (formData: FormData) => {
        try {
            await importStudent(formData);
            toast.success("Nhập dữ liệu thành công!");
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            const resData = axiosErr.response?.data;

            if (axiosErr.response?.status === 422) {
                // 1a. Lỗi từng dòng trong file Excel (mảng lỗi từ getErrors())
                if (Array.isArray(resData?.errors)) {
                    const errors = resData.errors;

                    setImportErrors(errors); // << lưu để hiển thị dialog

                    if (resData.success_count) {
                        toast.success(`Thêm thành công ${resData.success_count} dòng`)
                    }
                }
                // 1b. Lỗi validate trực tiếp từ Laravel validate()
                else if (resData?.errors && typeof resData.errors === 'object') {
                    Object.entries(resData.errors).forEach(([field, messages]) => {
                        const msg = Array.isArray(messages) ? messages.join(', ') : messages;
                        toast.error(`${field}: ${msg}`);
                    });
                }
                return;
            }


            // 4. Lỗi quá kích thước file (413 Payload Too Large)
            if (axiosErr.response?.status === 413) {
                toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn.");
                return;
            }

            // 5. Các lỗi khác
            toast.error(resData?.message || "Đã xảy ra lỗi không xác định.");
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
            meta: { displayName: "Giới tính", hidden: true },
        }),
        columnHelper.accessor((r) => r.place_of_birth, {
            id: "place_of_birth",
            header: (info) => <DefaultHeader info={info} name="Nơi sinh" />,
            enableGlobalFilter: true,
            size: 150,
            meta: { displayName: "Nơi sinh", hidden: true },
        }),
        columnHelper.accessor((r) => r.user.username, {
            id: "username",
            header: (info) => <DefaultHeader info={info} name="Tên đăng nhập" />,
            enableGlobalFilter: true,
            size: 150,
            meta: { displayName: "Tên đăng nhập", hidden: true },
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
        columnHelper.accessor((r) => r.user.identity_number, {
            id: "identity_number",
            header: (info) => <DefaultHeader info={info} name="CMND/CCCD" />,
            enableGlobalFilter: false,
            size: 140,
            meta: { displayName: "CMND/CCCD", hidden: true },
        }),
        columnHelper.accessor((r) => r.user.issued_place, {
            id: "issued_place",
            header: (info) => <DefaultHeader info={info} name="Nơi cấp" />,
            enableGlobalFilter: false,
            size: 130,
            meta: { displayName: "Nơi cấp", hidden: true },
        }),
        columnHelper.accessor((r) => format(new Date(r.user.issued_date), "dd/MM/yyyy", { locale: vi }), {
            id: "issued_date",
            header: (info) => <DefaultHeader info={info} name="Ngày cấp" />,
            enableGlobalFilter: false,
            size: 110,
            meta: { displayName: "Ngày cấp", hidden: true },
        }),
        columnHelper.accessor((r) => r.user.ethnicity, {
            id: "ethnicity",
            header: (info) => <DefaultHeader info={info} name="Dân tộc" />,
            enableGlobalFilter: false,
            size: 120,
            meta: { displayName: "Dân tộc", hidden: true },
        }),
        columnHelper.accessor((r) => r.user.religion, {
            id: "religion",
            header: (info) => <DefaultHeader info={info} name="Tôn giáo" />,
            enableGlobalFilter: false,
            size: 120,
            meta: { displayName: "Tôn giáo", hidden: true },
        }),
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
        columnHelper.accessor((r) => r.school_class.name, {
            id: "class_name",
            header: (info) => <DefaultHeader info={info} name="Lớp" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Lớp" },
        }),
        columnHelper.display({
            id: "is_active",
            header: "Trạng thái",
            cell: ({ row }) => {
                const sutdent = row.original;
                const active = sutdent.user?.is_active;
                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={!!active}
                            onCheckedChange={async () => {
                                try {
                                    await handleActive(sutdent);
                                } catch (error) {
                                    toast.error("Cập nhật trạng thái thất bại");
                                }
                            }}
                            className={clsx(
                                "data-[state=checked]:bg-green-500",
                                "data-[state=unchecked]:bg-red-500",
                                "cursor-pointer"
                            )}
                        />
                        {/* <span className="text-sm">{active ? "Hoạt động" : "Đã khóa"}</span> */}
                    </div>
                );
            },
            enableGlobalFilter: true,
            size: 80,
            meta: { displayName: "Trạng thái tài khoản" },
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const student = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <Link
                            href={`/admin/lists/students/${student.user_id}`}
                            className="text-gray-500"
                        >
                            <TbScanEye />
                        </Link>

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
            meta: { displayName: "Tùy chọn" },
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
                        onImportClick={() => setShowImportForm(true)}
                    />

                    {showImportForm && (
                        <FormModal
                            table="import"
                            type="create"
                            onUpload={handleUpload}
                            onClose={() => {
                                setShowImportForm(false);
                            }}
                        />
                    )}

                    {showAddForm && (
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
                    )}

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

                    {importErrors && (
                        <ConfirmDialog
                            open={!!importErrors}
                            title="Chi tiết lỗi khi nhập file"
                            message={
                                <div className="max-h-[300px] overflow-y-auto space-y-2 text-sm text-left">
                                    {importErrors.map((err, idx) => (
                                        <div key={idx}>
                                            <div className="font-semibold">Dòng {err.row}:</div>
                                            <ul className="list-disc list-inside">
                                                {Object.entries(err.errors).map(([field, messages]: [string, any], i) => (
                                                    <li key={i}>
                                                        {field}: {Array.isArray(messages) ? messages.join(', ') : messages}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            }
                            confirmText="Đóng"
                            onConfirm={() => setImportErrors(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default StudentPage;
