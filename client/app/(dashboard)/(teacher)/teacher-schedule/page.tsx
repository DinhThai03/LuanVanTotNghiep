"use client";

import BigCalendar from "@/components/BigCalender";
import { ScrollArea } from "@/components/ui/scroll-area";
import { profile } from "@/features/auth/api";
import { getAttendances, getTeacherAttendances } from "@/services/Attendances";
import { getOneTeachers } from "@/services/Teacher";
import { TeacherData } from "@/types/TeacherType";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const [data, setData] = useState<any[]>([]);
    const [teacher, setTeacher] = useState<TeacherData>();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await profile();
                const sRes = await getOneTeachers(res.id);
                setTeacher(sRes);
            } catch (err) {
                toast.error("Lỗi khi tải thông tin giảng viên");
                console.error(err);
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                const res = await getTeacherAttendances(teacher?.code!);
                setData(res);
            } catch (err) {
                toast.error("Lỗi khi tải dữ liệu điểm danh");
                console.error(err);
            }
        };
        if (teacher) fetchAttendances();
    }, [teacher]);

    return (

        <ScrollArea className="w-full h-[calc(100vh-60px)] bg-white">
            {
                teacher &&
                <div className='min-h-[calc(100vh-60px)] mx-auto p-4 bg-white shadow-md'>
                    <div className='w-full border-b-2 border-gray-300 mb-4'>
                        <div className="p-4 max-w-xl mx-auto space-y-2 text-gray-700">
                            <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
                                THÔNG TIN GIẢNG VIÊN
                            </h2>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="font-semibold">Họ & tên:</div>
                                <div className="col-span-2">{teacher?.user.last_name} {teacher?.user.first_name}</div>

                                <div className="font-semibold">Mã giảng viên:</div>
                                <div className="col-span-2">{teacher?.code}</div>

                                <div className="font-semibold">Ngày sinh:</div>
                                <div className="col-span-2">{moment(teacher?.user.date_of_birth).format("DD/MM/YYYY")}</div>

                                <div className="font-semibold">Giới tính:</div>
                                <div className="col-span-2">
                                    {teacher?.user.sex === true ? "Nam" : teacher?.user.sex === false ? "Nữ" : "Khác"}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Lịch học */}
                    <div className="w-full max-w-7xl m-auto">
                        <BigCalendar events={data} role="teacher" />
                    </div>
                </div>
            }
        </ScrollArea>

    );
};

export default Page;