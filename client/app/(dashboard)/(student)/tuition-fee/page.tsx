"use client";
import { useEffect, useState } from "react";
import TuitionFeeForm from "@/components/form/TuitionFeeForm";
import { toast } from "sonner";
import { getStudentTuitionFee } from "@/services/TuitionFee";
import { profile } from "@/features/auth/api";
import { getOneStudent } from "@/services/Student";
import { StudentData } from "@/types/StudentType";
import { getOneParents } from "@/services/Parents";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSemestersByStudent } from "@/services/Semesters";
import { SemesterData } from "@/types/SemesterType";

const TuitionFeePage = () => {
    const [tuitionData, setTuitionData] = useState<{
        semester: string;
        tuition_fees: any[];
    } | null>(null);

    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingTuition, setLoadingTuition] = useState(false);

    const [semesters, setSemesters] = useState<SemesterData[]>([]);
    const [semesterId, setSemesterId] = useState<number | undefined>(undefined);

    // Lấy thông tin sinh viên & danh sách học kỳ
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const user = await profile();
                let fetchedStudent: StudentData | null = null;

                if (user?.role === "student") {
                    fetchedStudent = await getOneStudent(user.id);
                } else if (user?.role === "parent") {
                    const parent = await getOneParents(user.id);
                    fetchedStudent = parent?.data?.student || null;
                }

                if (!fetchedStudent) {
                    toast.error("Không tìm thấy sinh viên");
                    return setLoading(false);
                }

                setStudent(fetchedStudent);

                const semesterList = await getSemestersByStudent(fetchedStudent?.user_id);
                setSemesters(semesterList.data);

            } catch (err) {
                toast.error("Không thể tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Gọi API học phí khi có student & semesterId
    useEffect(() => {
        const fetchTuitionFee = async () => {
            if (!student) return;

            setLoadingTuition(true);
            try {
                const data = await getStudentTuitionFee(student.code, semesterId);
                setTuitionData(data);
            } catch (err) {
                toast.error("Không thể tải học phí");
                setTuitionData(null);
            } finally {
                setLoadingTuition(false);
            }
        };

        fetchTuitionFee();
    }, [student, semesterId]);

    // ✅ Loading toàn trang
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    return (
        <ScrollArea className="bg-white w-full h-[calc(100vh-60px)]">
            <div className="w-full max-w-5xl min-h-[calc(100vh-60px)] mx-auto p-4 bg-white shadow-md">

                {/* Thông tin sinh viên */}
                {student && (
                    <div className="p-4 max-w-xl mx-auto space-y-2 text-gray-700">
                        <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
                            THÔNG TIN SINH VIÊN
                        </h2>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="font-semibold">Họ & tên:</div>
                            <div className="col-span-2">{student.user.last_name} {student.user.first_name}</div>

                            <div className="font-semibold">Mã sinh viên:</div>
                            <div className="col-span-2">{student.code}</div>

                            <div className="font-semibold">Ngày sinh:</div>
                            <div className="col-span-2">{moment(student.user.date_of_birth).format("DD/MM/YYYY")}</div>

                            <div className="font-semibold">Giới tính:</div>
                            <div className="col-span-2">
                                {student.user.sex === true ? "Nam" : student.user.sex === false ? "Nữ" : "Khác"}
                            </div>
                        </div>
                    </div>
                )}

                {/* Select học kỳ */}
                <div className="p-4 max-w-xl mx-auto text-gray-700">
                    <label className="text-sm font-semibold mr-2">Chọn học kỳ:</label>
                    <select
                        value={semesterId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSemesterId(value ? Number(value) : undefined);
                        }}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value={undefined}>-- Học kì hiện tại --</option>
                        {semesters.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name + " (" + s.academic_year.start_year + " - " + s.academic_year.end_year + ")"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Học phí + loading */}
                <div className="relative">
                    {loadingTuition && (
                        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
                        </div>
                    )}

                    {tuitionData && (
                        <TuitionFeeForm
                            semesterName={tuitionData.semester}
                            tuitionFees={tuitionData.tuition_fees}
                        />
                    )}
                </div>
            </div>
        </ScrollArea>
    );
};

export default TuitionFeePage;
