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
import { deleteRegistration, getRegistrations } from "@/services/Registration";
import { RegistrationData } from "@/types/RegistrationType";
import { getSemesters } from "@/services/Semesters";
import { SemesterData } from "@/types/SemesterType";
import { getFacultys } from "@/services/Faculty";
import { FacultyData } from "@/types/FacultyType";
import { ClassedData } from "@/types/ClassedType";
import { getclasses } from "@/services/Classed";
import { ScrollArea } from "@/components/ui/scroll-area";

const columnHelper = createColumnHelper<RegistrationData>();

const RegistrationPage = () => {
    const [registrationMap, setRegistrationMap] = useState<Map<number, RegistrationData>>(new Map());
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);
    const [editingRegistration, setEditingRegistration] = useState<RegistrationData | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const [semesterId, setSemesterId] = useState<number | undefined>();
    const [semesters, setSemesters] = useState<SemesterData[]>([]);

    const [facultyId, setFacultyId] = useState<number | undefined>();
    const [faculties, setFaculties] = useState<FacultyData[]>([]);
    const [classId, setClassId] = useState<number | undefined>();
    const [classes, setClasses] = useState<ClassedData[]>([]);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const res = await getFacultys();
                setFaculties(res.data);
                setFacultyId(undefined);
            } catch {
                toast.error("Không thể tải danh sách khoa");
            }
        };
        fetchFaculties();

        const fetchSemesters = async () => {
            try {
                const res = await getSemesters();
                setSemesters(res.data);
                setSemesterId(undefined);
            } catch {
                toast.error("Không thể tải danh sách học kỳ");
            }
        };
        fetchSemesters();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getclasses(facultyId);
                setClasses(res.data);
                setClassId(undefined);
            } catch {
                toast.error("Không thể tải danh sách học kỳ");
            }
        };
        fetchClasses();
    }, [facultyId])

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                setLoading(true);
                const res = await getRegistrations(facultyId, classId, semesterId);
                const newMap = new Map<number, RegistrationData>();
                res.forEach((registration: RegistrationData) => newMap.set(registration.id, registration));
                setRegistrationMap(newMap);
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message = axiosErr.response?.data?.message || axiosErr.message || "Lỗi khi tải danh sách.";
                toast.error(message, { description: "Vui lòng kiểm tra lại" });
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [semesterId, facultyId, classId]);

    const handleAddSuccess = (registration: RegistrationData) => {
        setRegistrationMap(prev => new Map(prev).set(registration.id, registration));
    };

    const handleUpdateSuccess = (registration: RegistrationData) => {
        setRegistrationMap(prev => new Map(prev).set(registration.id, registration));
    };

    const handleDelete = async () => {
        if (!selectedRegistration) return;
        try {
            await deleteRegistration(selectedRegistration.id);
            setRegistrationMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedRegistration.id);
                return newMap;
            });
            toast.success("Xóa thành công");
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || "Lỗi khi xóa";
            toast.error("Xóa thất bại", { description: message });
        } finally {
            setShowConfirm(false);
            setSelectedRegistration(null);
        }
    };

    const columns = [
        // Checkbox chọn dòng
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            size: 10,
        }),

        // Môn học
        columnHelper.accessor("lesson.teacher_subject.subject.name", {
            id: "subject_name",
            header: (info) => <DefaultHeader info={info} name="Môn học" />,
            enableGlobalFilter: true,
            size: 200,
            meta: { displayName: "Môn học" },
        }),

        columnHelper.accessor("student.code", {
            id: "student_code",
            header: (info) => <DefaultHeader info={info} name="Mã SV" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Mã SV" },
        }),

        columnHelper.accessor(
            (row) => `${row.student.user.last_name} ${row.student.user.first_name}`,
            {
                id: "student_name",
                header: (info) => <DefaultHeader info={info} name="Tên SV" />,
                enableGlobalFilter: true,
                size: 160,
                meta: { displayName: "Tên SV" },
            }
        ),

        // Mã giáo viên
        columnHelper.accessor("lesson.teacher_subject.teacher_code", {
            id: "teacher_code",
            header: (info) => <DefaultHeader info={info} name="Mã GV" />,
            enableGlobalFilter: true,
            size: 120,
            meta: { displayName: "Mã GV" },
        }),

        // Tên giáo viên
        columnHelper.accessor(
            (row) => `${row.lesson.teacher_subject.teacher.user.last_name} ${row.lesson.teacher_subject.teacher.user.first_name}`,
            {
                id: "teacher_name",
                header: (info) => <DefaultHeader info={info} name="Tên GV" />,
                enableGlobalFilter: true,
                size: 160,
                meta: { displayName: "Tên GV" },
            }
        ),

        // Phòng học
        columnHelper.accessor("lesson.room.name", {
            id: "room_name",
            header: (info) => <DefaultHeader info={info} name="Phòng" />,
            size: 120,
            meta: { displayName: "Phòng" },
        }),

        // Thứ
        columnHelper.accessor("lesson.day_of_week", {
            id: "day_of_week",
            header: (info) => <DefaultHeader info={info} name="Thứ" />,
            cell: ({ getValue }) => {
                const day = getValue();
                return day === 1 ? "Chủ nhật" : `Thứ ${day}`;
            },
            size: 100,
            meta: { displayName: "Thứ" },
        }),

        // Giờ bắt đầu
        columnHelper.accessor("lesson.start_time", {
            id: "start_time",
            header: (info) => <DefaultHeader info={info} name="Giờ bắt đầu" />,
            cell: ({ getValue }) =>
                new Date(`1970-01-01T${getValue()}`).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            size: 120,
            meta: { displayName: "Giờ bắt đầu" },
        }),

        // Giờ kết thúc
        columnHelper.accessor("lesson.end_time", {
            id: "end_time",
            header: (info) => <DefaultHeader info={info} name="Giờ kết thúc" />,
            cell: ({ getValue }) =>
                new Date(`1970-01-01T${getValue()}`).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            size: 120,
            meta: { displayName: "Giờ kết thúc" },
        }),

        // Ngày bắt đầu
        columnHelper.accessor("lesson.start_date", {
            id: "start_date",
            header: (info) => <DefaultHeader info={info} name="Bắt đầu" />,
            cell: ({ getValue }) =>
                new Date(getValue()).toLocaleDateString("vi-VN"),
            size: 120,
            meta: { displayName: "Ngày bắt đầu", hidden: true },
        }),

        // Ngày kết thúc
        columnHelper.accessor("lesson.end_date", {
            id: "end_date",
            header: (info) => <DefaultHeader info={info} name="Kết thúc" />,
            cell: ({ getValue }) =>
                new Date(getValue()).toLocaleDateString("vi-VN"),
            size: 120,
            meta: { displayName: "Ngày kết thúc", hidden: true },
        }),


        // Tùy chọn
        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const lesson = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingRegistration(lesson);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedRegistration(lesson);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            size: 100,
        }),
    ];


    return (
        <div className="w-full p-4 bg-white">
            <div className="w-full whitespace-nowrap mb-2 overflow-x-auto">
                <div className='flex gap-4'>
                    <div className="">
                        <label className="text-sm font-semibold mr-2">Chọn khoa:</label>
                        <select
                            value={facultyId}
                            onChange={(e) => setFacultyId(Number(e.target.value))}
                            className="border border-gray-300 rounded p-2"
                        >

                            <option key={0} value={undefined}>
                                --- Tất cả khoa ---
                            </option>
                            {faculties.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>
                                    {faculty.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className={facultyId == undefined ? "opacity-30" : ""}>
                        <label className="text-sm font-semibold mr-2">Chọn lớp:</label>
                        <select
                            value={classId}
                            onChange={(e) => setClassId(Number(e.target.value))}
                            className="border border-gray-300 rounded p-2"
                            disabled={facultyId == undefined}
                        >

                            <option key={0} value={undefined}>
                                --- Tất cả lớp ---
                            </option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="">
                        <label className="text-sm font-semibold mr-2">Chọn học kỳ:</label>
                        <select
                            value={semesterId}
                            onChange={(e) => setSemesterId(Number(e.target.value))}
                            className="border border-gray-300 rounded p-2"
                        >

                            <option key={0} value={undefined}>
                                --- Tất cả học kì ---
                            </option>
                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                    {semester.name + " - (" + semester.academic_year.start_year + " - " + semester.academic_year.start_year + ")"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {
                loading ? (
                    <div className="text-center py-10 text-gray-500">
                        Đang tải danh sách registration...
                    </div>
                ) : (
                    <>
                        <DataTable<RegistrationData, any>
                            columns={columns}
                            data={Array.from(registrationMap.values())}
                            className="h-[calc(100vh-150px)]"
                            onAddClick={() => {
                                setShowAddForm(true);
                                setShowUpdateForm(false);
                                setEditingRegistration(null);
                            }}
                        />

                        {showAddForm && (
                            <FormModal
                                table="registration"
                                type="create"
                                onClose={() => setShowAddForm(false)}
                                onSubmitSuccess={handleAddSuccess}
                            />
                        )}

                        {showUpdateForm && editingRegistration && (
                            <FormModal
                                table="registration"
                                type="update"
                                data={editingRegistration}
                                onClose={() => {
                                    setShowUpdateForm(false);
                                    setEditingRegistration(null);
                                }}
                                onSubmitSuccess={handleUpdateSuccess}
                            />
                        )}

                        <ConfirmDialog
                            open={showConfirm}
                            title="Xác nhận xóa"
                            message={`Bạn có chắc chắn muốn xóa registration “” không?`}
                            confirmText="Xóa"
                            cancelText="Hủy"
                            onCancel={() => {
                                setShowConfirm(false);
                                setSelectedRegistration(null);
                            }}
                            onConfirm={handleDelete}
                        />
                    </>
                )
            }
        </div >
    );
};

export default RegistrationPage;
