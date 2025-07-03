"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBook, FaBookOpen, FaChalkboardTeacher, FaUserCircle, FaUserGraduate } from "react-icons/fa";
import { getAttendances } from "@/services/Attendances";
import BigCalendar from "@/components/BigCalender";
import { getStudentInfo } from "@/services/Student";
import { StudentSummary } from "@/types/StudentType";
import { FaPhone } from "react-icons/fa6";
import { MdPlaylistAddCheckCircle } from "react-icons/md";

const SingleStudentPage = () => {
    const { id } = useParams();
    const [data, setData] = useState<any[]>([]);
    const [student, setStudent] = useState<StudentSummary>();

    useEffect(() => {
        if (!id) return;
        const studentId = typeof id === 'string' ? Number(id) : 0;

        const fetchData = async () => {
            try {
                const studentRes = await getStudentInfo(studentId);
                console.log("student>>", studentRes)
                setStudent(studentRes);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAttendances = async () => {
            const res = await getAttendances(student?.student_code!);
            setData(res);
            console.log(">>>", res);
        }
        if (student)
            fetchAttendances()
    }, [student])

    return (
        <div className="w-full flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-white py-6 px-4 rounded-md flex-1 flex gap-4 ">
                        <div className="w-30 mr-4 aspect-square">
                            <FaUserCircle className="w-full h-full  text-gray-900/50" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{student?.full_name}</h1>
                            </div>
                            <p className="text-sm text-gray-500">
                                {student?.email}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">

                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <FaUserGraduate />
                                    <span>{student?.student_code}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <FaPhone />
                                    <span>{student?.phone}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* SMALL CARDS */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap text-gray-500">
                        {/* CARD */}
                        <div className="justify-start items-center bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <FaBookOpen className="h-full w-auto" />
                            <div className="">
                                <h1 className="text-md font-semibold">{student?.registration_count}</h1>
                                <span className="text-sm text-gray-400">Đang học</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="justify-start items-center bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <FaBook className="h-full w-auto" />
                            <div className="">
                                <h1 className="text-md font-semibold">{student?.finished_subjects_count}</h1>
                                <span className="text-sm text-gray-400">Đã học</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="justify-start items-center bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <FaChalkboardTeacher className="h-full w-auto" />
                            <div className="">
                                <h1 className="text-md font-semibold">{student?.class}</h1>
                                <span className="text-sm text-gray-400">Lớp</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="justify-start items-center bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <MdPlaylistAddCheckCircle className="h-full w-auto" />
                            <div className="">
                                <h1 className="text-md font-semibold">{student?.status_label}</h1>
                                <span className="text-sm text-gray-400"></span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 w-full bg-white rounded-md p-4 h-auto md:h-[calc(100vh-290px)]">
                    <h1>Thời khóa biểu</h1>
                    <BigCalendar events={data} />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md h-full">
                    <h1 className="text-xl font-semibold">Khác</h1>
                    <div className="mt-4 gap-4 text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
                            Danh sách lớp
                        </Link>
                        <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
                            Môn đang học
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default SingleStudentPage;
