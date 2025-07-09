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
    FaPhone
} from "react-icons/fa";
import { MdPlaylistAddCheckCircle } from "react-icons/md";

import { getAttendances, getTeacherAttendances } from "@/services/Attendances";
import { getTeacherInfo } from "@/services/Teacher";

import BigCalendar from "@/components/BigCalender";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TeacherInfo } from "@/types/TeacherType";

const getStatusLabel = (status: string) => {
    switch (status) {
        case "Probation":
            return "Thử việc";
        case "Official":
            return "Chính thức";
        case "Resigned":
            return "Đã nghỉ";
        default:
            return "Không rõ";
    }
};

const InfoCard = ({
    icon,
    label,
    value
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
}) => (
    <div className="flex items-center bg-white p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] shadow-sm">
        <div className="text-2xl text-blue-400">{icon}</div>
        <div>
            <h1 className="text-md font-semibold text-gray-700">{value}</h1>
            <span className="text-sm text-gray-500">{label}</span>
        </div>
    </div>
);

const SingleTeacherPage = () => {
    const { id } = useParams();
    const [data, setData] = useState<any[]>([]);
    const [teacher, setTeacher] = useState<TeacherInfo>();

    useEffect(() => {
        if (!id) return;
        const teacherId = typeof id === "string" ? Number(id) : 0;

        const fetchData = async () => {
            try {
                const teacherRes = await getTeacherInfo(teacherId);
                setTeacher(teacherRes);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAttendances = async () => {
            if (!teacher) return;
            try {
                const res = await getTeacherAttendances(teacher.code);
                setData(res);
            } catch (error) {
                console.error("Lỗi khi lấy lịch dạy:", error);
            }
        };

        if (teacher) fetchAttendances();
    }, [teacher]);

    if (!teacher) {
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
                                {teacher.user.full_name}
                            </h1>
                            <p className="text-sm text-gray-500">{teacher.user.email}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaUserGraduate />
                                    <span>{teacher.code}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaPhone />
                                    <span>{teacher.user.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-wrap gap-4 justify-between text-gray-500">
                        <InfoCard icon={<FaBookOpen />} label="Khoa" value={teacher.faculty.name} />
                        <InfoCard icon={<FaBook />} label="Môn đang dạy" value={teacher.total_subjects} />
                        <InfoCard icon={<FaChalkboardTeacher />} label="Bài giảng" value={teacher.total_lessons} />
                        <InfoCard icon={<MdPlaylistAddCheckCircle />} label="Trạng thái" value={getStatusLabel(teacher.status)} />
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
                        <Link
                            className="p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                            href="/"
                        >
                            📚 Danh sách lớp
                        </Link>
                        <Link
                            className="p-2 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                            href="/"
                        >
                            📘 Môn đang học
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleTeacherPage;
