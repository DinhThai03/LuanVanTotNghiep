"use client";

import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { getTuitionSummary } from "@/services/TuitionFee";
import { getSemesters } from "@/services/Semesters";
import { SemesterData } from "@/types/SemesterType";
import { StudentInfo, StudentTuitionData } from "@/types/TuitionFeeType";
import { Checkbox } from "@/components/ui/checkbox";
import { getclasses } from "@/services/Classed";
import { ClassedData } from "@/types/ClassedType";
import { TbCreditCardPay } from "react-icons/tb";
import FormModal from "@/components/form/FormModal";
import { getFacultys } from "@/services/Faculty";

const columnHelper = createColumnHelper<StudentTuitionData>();

const TuitionFeePage = () => {
    const [tuitionFeeList, setTuitionFeeList] = useState<Map<number, StudentTuitionData>>(new Map());
    const [loading, setLoading] = useState(true);

    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [editStudentTuition, setEditStudentTuition] = useState<StudentTuitionData | null>(null);

    const [semesterId, setSemesterId] = useState<number | undefined>(undefined);
    const [semesters, setSemesters] = useState<SemesterData[]>([]);

    const [facultyId, setFacultyId] = useState<number | undefined>(undefined);
    const [faculties, setFaculties] = useState<any[]>([]);

    const [classId, setClassId] = useState<number | undefined>();
    const [classes, setClasses] = useState<ClassedData[]>([]);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const res = await getSemesters();
                if (res && res.data.length > 0) {
                    setSemesterId(res.data[0].id);
                    setSemesters(res.data);
                }
            } catch {
                toast.error("Không thể tải danh sách học kỳ");
            }
        };

        const fetchFaculties = async () => {
            try {
                const res = await getFacultys();
                setFaculties(res.data);
            } catch {
                toast.error("Không thể tải danh sách khoa");
            }
        };

        fetchSemesters();
        fetchFaculties();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getclasses(facultyId);
                setClasses(res.data);
                setClassId(undefined);
            } catch {
                toast.error("Không thể tải danh sách lớp");
            }
        };
        if (facultyId !== undefined) fetchClasses();
    }, [facultyId]);

    useEffect(() => {
        const fetchTuitionFees = async () => {
            if (semesterId == undefined) return;
            try {
                setLoading(true);
                const res = await getTuitionSummary(semesterId, facultyId); // res.students: StudentTuitionData[]
                const map = new Map<number, StudentTuitionData>();
                (res.students as StudentTuitionData[]).forEach((stu, idx) => {
                    map.set(idx + 1, stu);
                });

                setTuitionFeeList(map);
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;

                if (axiosErr.response?.data?.message) {
                    message = axiosErr.response.data.message;
                } else if (axiosErr.response?.data?.error) {
                    message = axiosErr.response.data.error;
                } else if (axiosErr.message === "Network Error") {
                    message = "Không thể kết nối đến server.";
                } else {
                    message = "Đã có lỗi xảy ra khi lấy học phí.";
                }

                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTuitionFees();
    }, [semesterId, facultyId]);

    const handleUpdateSuccess = (tuitionFee: StudentTuitionData) => {
        setTuitionFeeList(prev => {
            const newMap = new Map(prev);
            newMap.forEach((v, k) => {
                if (v.student.code === tuitionFee.student.code) {
                    newMap.set(k, tuitionFee);
                }
            });
            return newMap;
        });
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

        columnHelper.accessor((row) => row.student.code, {
            id: "student_code",
            header: (info) => <DefaultHeader info={info} name="Mã sinh viên" />,
            enableGlobalFilter: true,
            size: 100,
        }),

        columnHelper.accessor((row) => row.student.full_name, {
            id: "name",
            header: (info) => <DefaultHeader info={info} name="Tên sinh viên" />,
            enableGlobalFilter: true,
            size: 200,
        }),

        columnHelper.accessor((row) => row.student.email, {
            id: "email",
            header: (info) => <DefaultHeader info={info} name="Email" />,
            size: 200,
        }),

        columnHelper.accessor((row) => row.faculties.map(f => f.name).join(", "), {
            id: "faculties",
            header: (info) => <DefaultHeader info={info} name="Khoa" />,
            size: 200,
        }),

        columnHelper.accessor((row) => row.class, {
            id: "class",
            header: (info) => <DefaultHeader info={info} name="Lớp" />,
            size: 150,
        }),

        columnHelper.accessor("paid_amount", {
            id: "paid_amount",
            header: (info) => <DefaultHeader info={info} name="Đã đóng" />,
            cell: ({ getValue }) => (
                <span className="text-green-600">
                    {Number(getValue()).toLocaleString("vi-VN")} đ
                </span>
            ),
            size: 120,
        }),

        columnHelper.accessor("remaining_amount", {
            id: "remaining_amount",
            header: (info) => <DefaultHeader info={info} name="Chưa đóng" />,
            cell: ({ getValue }) => (
                <span className="text-red-600">
                    {Number(getValue()).toLocaleString("vi-VN")} đ
                </span>
            ),
            size: 120,
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Thanh toán",
            cell: ({ row }) => {
                const tuition = row.original;
                const remaining = tuition.remaining_amount;

                if (remaining > 0) {
                    return (
                        <div className="flex">
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-white bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-sm"
                                onClick={() => {
                                    setEditStudentTuition(tuition);
                                    setShowUpdateForm(true);
                                }}
                            >
                                <TbCreditCardPay className="text-xl" />
                                <span className="text-sm font-medium">Thanh toán</span>
                            </button>
                        </div>
                    );
                }

                return (
                    <span className="text-gray-500 font-medium">Đã hoàn tất</span>
                );
            },
            size: 150,
        }),

    ];

    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4 space-y-4">
            <div className="text-xl font-semibold text-gray-700">
                Thống kê học phí
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <label className="text-sm font-semibold mr-2">Chọn học kỳ:</label>
                    <select
                        value={semesterId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSemesterId(value ? Number(value) : undefined);
                        }}
                        className="border border-gray-300 rounded p-2"
                    >
                        {semesters.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name + " (" + s.academic_year.start_year + " - " + s.academic_year.end_year + ")"}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold mr-2">Chọn khoa:</label>
                    <select
                        value={facultyId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFacultyId(value ? Number(value) : undefined);
                        }}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="">-- Tất cả khoa --</option>
                        {faculties.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={facultyId == undefined ? "opacity-30" : ""}>
                    <label className="text-sm font-semibold mr-2">Chọn lớp:</label>
                    <select
                        value={classId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setClassId(value ? Number(value) : undefined);
                        }}
                        className="border border-gray-300 rounded p-2"
                        disabled={facultyId == undefined}
                    >
                        <option value="">--- Tất cả lớp ---</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải dữ liệu học phí...
                </div>
            ) : (
                <>
                    <DataTable<StudentTuitionData, any>
                        columns={columns}
                        data={Array.from(tuitionFeeList.values())}
                        className="h-[calc(100vh-200px)]"
                    />
                    {showUpdateForm && editStudentTuition && (
                        <FormModal
                            table="tuitionFee"
                            type="create"
                            data={{
                                code: editStudentTuition.student.code,
                                semester_id: semesterId,
                            }}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditStudentTuition(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TuitionFeePage;
