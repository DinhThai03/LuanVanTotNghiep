"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FaBook,
    FaBookOpen,
    FaChalkboardTeacher,
    FaUserCircle,
    FaUserGraduate,
    FaPhone,
} from "react-icons/fa";
import { MdLockReset, MdPlaylistAddCheckCircle } from "react-icons/md";

import { getAttendances } from "@/services/Attendances";
import { getStudentInfo } from "@/services/Student";
import { StudentSummary } from "@/types/StudentType";
import BigCalendar from "@/components/BigCalender";
import { ScrollArea } from "@/components/ui/scroll-area";
import { resetDefaultPassword } from "@/features/auth/api";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

const InfoCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
}) => (
    <div className="flex items-center bg-white p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] shadow-sm">
        <div className="text-2xl text-gray-500">{icon}</div>
        <div>
            <h1 className="text-md font-semibold text-gray-700">{value}</h1>
            <span className="text-sm text-gray-500">{label}</span>
        </div>
    </div>
);

const SingleStudentPage = () => {
    const { id } = useParams();
    const [data, setData] = useState<any[]>([]);
    const [student, setStudent] = useState<StudentSummary>();
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!id) return;
        const studentId = typeof id === "string" ? Number(id) : 0;

        const fetchData = async () => {
            try {
                const studentRes = await getStudentInfo(studentId);
                setStudent(studentRes);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAttendances = async () => {
            if (!student) return;
            try {
                const res = await getAttendances(student.student_code);
                setData(res);
            } catch (error) {
                console.error("Lỗi khi lấy lịch học:", error);
            }
        };

        if (student) fetchAttendances();
    }, [student]);


    const handleResetPassword = async () => {
        try {
            const res = await resetDefaultPassword(Number(id));
            toast.success(`Đã đặt lại mật khẩu mặc định cho người dùng`);
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Đã xảy ra lỗi khi đặt lại mật khẩu";
            toast.error(message);
        }
    };

    if (!student) {
        return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="w-full flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            <div className="w-full xl:w-2/3">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="bg-white py-6 px-4 rounded-md flex-1 flex items-center gap-4 shadow-sm">
                        <div className="w-24 h-24 mr-4">
                            <FaUserCircle className="w-full h-full text-gray-900/50" />
                        </div>
                        <div className="flex flex-col justify-center gap-2 w-full">
                            <h1 className="text-xl font-semibold text-gray-800">
                                {student.full_name}
                            </h1>
                            <p className="text-sm text-gray-500">{student.email}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaUserGraduate />
                                    <span>{student.student_code}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaPhone />
                                    <span>{student.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-wrap gap-4 justify-between text-gray-500">
                        <InfoCard icon={<FaBookOpen />} label="Đang học" value={student.registration_count} />
                        <InfoCard icon={<FaBook />} label="Đã học" value={student.finished_subjects_count} />
                        <InfoCard icon={<FaChalkboardTeacher />} label="Lớp" value={student.class!} />
                        <InfoCard icon={<MdPlaylistAddCheckCircle />} label="Trạng thái" value={student.status_label} />
                    </div>
                </div>

                <ScrollArea className="mt-4 w-full bg-white rounded-md p-4 h-auto md:h-[calc(100vh-290px)] shadow-sm">
                    <h1 className="text-lg font-semibold text-gray-800 mb-2">Thời khóa biểu</h1>
                    <BigCalendar events={data} role="admin" />
                </ScrollArea>
            </div>

            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md h-full shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-700 mb-4">Liên kết nhanh</h1>
                    <div className="flex flex-col gap-3 text-sm">
                        <div
                            className=" flex gap-2 items-center p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                            onClick={() => setShowConfirm(true)}
                        >
                            <MdLockReset />
                            Đặt lại mật khẩu
                        </div>

                    </div>
                </div>
            </div>
            <ConfirmDialog
                title="Đặt lại mật khẩu"
                message="Mật khẩu sẽ được đặt lại về mật khẩu mặc định"
                open={showConfirm}
                confirmText="Đặt lại"
                cancelText="Hủy"
                onConfirm={handleResetPassword}
                onCancel={() => setShowConfirm(false)}
            />

        </div>
    );
};

export default SingleStudentPage;
