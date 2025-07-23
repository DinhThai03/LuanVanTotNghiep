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
import { deleteTeacher, getTeachers, importTeachers, updateTeacher } from "@/services/Teacher";
import { TeacherData } from "@/types/TeacherType";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { TeacherSubjectData } from "@/types/TeacherSubjectType";
import Link from "next/link";
import { TbScanEye } from "react-icons/tb";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";

const columnHelper = createColumnHelper<TeacherData>();

const TeacherPage = () => {
    const [teacherMap, setTeacherMap] = useState<Map<number, TeacherData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null);
    const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);

    const [showImportForm, setShowImportForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [importErrors, setImportErrors] = useState<any[] | null>(null);


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

    const handleUpload = async (formData: FormData) => {
        try {
            await importTeachers(formData);
            toast.success("Nhập dữ liệu thành công!");
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            const resData = axiosErr.response?.data;

            if (axiosErr.response?.status === 422) {
                // 1a. Lỗi từng dòng trong file Excel (mảng lỗi từ getErrors())
                if (Array.isArray(resData?.errors)) {
                    const errors = resData.errors;

                    setImportErrors(errors); // << lưu để hiển thị dialog

                    if (errors.length <= 5) {
                        errors.forEach((errObj: any) => {
                            const row = errObj.row;
                            const messages = Object.entries(errObj.errors)
                                .map(([field, msgList]) => `${field}: ${(Array.isArray(msgList) ? msgList.join(', ') : msgList)}`)
                                .join(' | ');
                            toast.error(`Dòng ${row}: ${messages}`);
                        });
                    } else {
                        toast.error(`Có ${errors.length} dòng lỗi. Vui lòng kiểm tra chi tiết.`);
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
                description: "không thể xóa giảng viên này"
            });
        } finally {
            setShowConfirm(false);
            setSelectedTeacher(null);
        }
    };

    const handleActive = async (teacher: TeacherData) => {
        const form = new FormData();
        form.append("is_active", teacher.user.is_active ? "0" : "1");
        teacher.teacher_subjects.forEach((ts) => {
            form.append("subject_ids[]", String(ts.subject_id));
        });
        const res = await updateTeacher(teacher.code, form);

        setTeacherMap(prev => new Map(prev).set(teacher.user_id, res.data.data));
    }

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

        columnHelper.accessor((r) => r.user_id, {
            id: "user_id",
            header: (info) => <DefaultHeader info={info} name="id" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "id", hidden: true },
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
            cell: ({ getValue }) => {
                const value = getValue();
                const statusMap: Record<string, string> = {
                    Probation: "Thử việc",
                    Official: "Chính thức",
                    Resigned: "Đã nghỉ",
                };
                return statusMap[value] || "Không rõ";
            },
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

        columnHelper.display({
            id: "is_active",
            header: "Trạng thái",
            cell: ({ row }) => {
                const teacher = row.original;
                const active = teacher.user?.is_active;


                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={!!active}
                            onCheckedChange={async () => {
                                try {
                                    await handleActive(teacher);
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
                        onImportClick={() => setShowImportForm(true)}
                    />

                    {showAddForm && (
                        <FormModal
                            table="teacher"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

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

export default TeacherPage;
