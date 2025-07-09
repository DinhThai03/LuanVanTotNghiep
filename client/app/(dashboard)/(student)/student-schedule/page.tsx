"use client";

import BigCalendar from "@/components/BigCalender";
import { ScrollArea } from "@/components/ui/scroll-area";
import { profile } from "@/features/auth/api";
import { getAttendances } from "@/services/Attendances";
import { getOneParents } from "@/services/Parents";
import { getOneStudent } from "@/services/Student";
import { StudentData } from "@/types/StudentType";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const [data, setData] = useState<any[]>([]);
    const [student, setStudent] = useState<StudentData>();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await profile();
                if (res?.role === "student") {
                    const sRes = await getOneStudent(res.id);
                    setStudent(sRes);
                } else if (res?.role === "parent") {
                    const pRes = await getOneParents(res.id);
                    const student = pRes?.data?.student;
                    if (student) setStudent(student);
                }
            } catch (err) {
                toast.error("Lỗi khi tải thông tin sinh viên");
                console.error(err);
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                const res = await getAttendances(student?.code!);
                setData(res);
            } catch (err) {
                toast.error("Lỗi khi tải dữ liệu điểm danh");
                console.error(err);
            }
        };
        if (student) fetchAttendances();
    }, [student]);

    return (


        <ScrollArea className="w-full h-[calc(100vh-60px)] bg-white">
            <div className='min-h-[calc(100vh-60px)] mx-auto p-4 bg-white shadow-md'>
                <div className='w-full border-b-2 border-gray-300 mb-4'>
                    <div className="p-4 max-w-xl mx-auto space-y-2 text-gray-700">
                        <h2 className="text-lg font-semibold text-center text-gray-800 mb-2">
                            THÔNG TIN SINH VIÊN
                        </h2>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="font-semibold">Họ & tên:</div>
                            <div className="col-span-2">{student?.user.last_name} {student?.user.first_name}</div>

                            <div className="font-semibold">Mã sinh viên:</div>
                            <div className="col-span-2">{student?.code}</div>

                            <div className="font-semibold">Ngày sinh:</div>
                            <div className="col-span-2">{moment(student?.user.date_of_birth).format("DD/MM/YYYY")}</div>

                            <div className="font-semibold">Giới tính:</div>
                            <div className="col-span-2">
                                {student?.user.sex === true ? "Nam" : student?.user.sex === false ? "Nữ" : "Khác"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lịch học */}
                <div className="w-full max-w-7xl m-auto">
                    <BigCalendar events={data} role="student" />
                </div>
            </div>
        </ScrollArea>


    );
};

export default Page;
