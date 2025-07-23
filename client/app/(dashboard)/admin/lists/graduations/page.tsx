"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";
import { AxiosError } from "axios";

import { DataTable } from "@/components/ui/data-table";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import { getGraduationList } from "@/services/Graduation";
import { getCohorts } from "@/services/Cohort";
import { getFacultys } from "@/services/Faculty";

import { GraduationStudentResult } from "@/types/GraduationType";
import { FacultyData } from "@/types/FacultyType";
import { Cohort } from "@/types/NameType";


const columnHelper = createColumnHelper<GraduationStudentResult>();

const GraduationListPage = () => {
    const [students, setStudents] = useState<GraduationStudentResult[]>([]);
    const [loading, setLoading] = useState(true);

    const [cohortId, setCohortId] = useState<number>();
    const [facultyId, setFacultyId] = useState<number>();
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [faculties, setFaculties] = useState<FacultyData[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [cohortRes, facultyRes] = await Promise.all([
                    getCohorts(),
                    getFacultys()
                ]);

                const cohortList = cohortRes;
                const facultyList = facultyRes.data;

                setCohorts(cohortList);
                setFaculties(facultyList);

                if (cohortList.length > 0) setCohortId(cohortList[0].id);
                if (facultyList.length > 0) setFacultyId(facultyList[0].id);
            } catch {
                toast.error("Không thể tải danh sách khóa hoặc khoa");
            }
        };
        fetchFilters();
    }, []);


    useEffect(() => {
        if (!cohortId || !facultyId) return;
        const fetchGraduationList = async () => {
            try {
                setLoading(true);
                const res = await getGraduationList(Number(cohortId), Number(facultyId));
                setStudents(res);
            } catch (err) {
                const message = "Đã có lỗi xảy ra khi lấy danh sách tốt nghiệp.";

                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchGraduationList();
    }, [cohortId, facultyId]);

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

        columnHelper.accessor("student_code", {
            header: (info) => <DefaultHeader info={info} name="Mã sinh viên" />,
            size: 140,
        }),
        columnHelper.accessor("student_name", {
            header: (info) => <DefaultHeader info={info} name="Họ tên" />,
            size: 130,
        }),
        columnHelper.accessor("can_graduate", {
            header: (info) => <DefaultHeader info={info} name="Tốt nghiệp" />,
            cell: ({ getValue }) => (
                <div className='w-full pl-7 text-xl'>
                    {getValue() ? (
                        <FaCheckCircle className="text-green-500" />
                    ) : (
                        <FaCircleXmark className="text-red-500" />
                    )}
                </div>
            ),
            size: 100,
        }),
        columnHelper.accessor("graduation_rank", {
            header: (info) => <DefaultHeader info={info} name="Xếp loại" />,
            cell: ({ getValue }) => getValue() || "-",
            size: 140,
        }),
        columnHelper.display({
            id: "yearly_gpa",
            header: () => "GPA theo năm",
            cell: ({ row }) => (
                <div className="text-sm text-gray-700">
                    {row.original.yearly_gpa.length > 0 ? (
                        <ul>
                            {row.original.yearly_gpa.map((y, i) => (
                                <li key={i}>
                                    {y.academic_year}: {y.gpa} (Tín chỉ: {y.total_credits})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span>-</span>
                    )}
                </div>
            ),
            size: 250,
        }),
    ];

    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {/* Bộ lọc */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <div>
                    <label className="text-sm font-semibold mr-2">Khóa:</label>
                    <select
                        className="border rounded p-2"
                        value={cohortId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value ? Number(e.target.value) : undefined;
                            setCohortId(value);
                        }}
                    >
                        {cohorts.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold mr-2">Khoa:</label>
                    <select
                        className="border rounded p-2"
                        value={facultyId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value ? Number(e.target.value) : undefined;
                            setFacultyId(value);
                        }}
                    >
                        {faculties.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách tốt nghiệp...
                </div>
            ) : (
                <DataTable<GraduationStudentResult, any>
                    columns={columns}
                    data={students}
                    className="h-[calc(100vh-150px)]"
                />
            )}
        </div>
    );
};

export default GraduationListPage;
