"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { FaAdn, FaUserCircle } from "react-icons/fa";

const SingleTeacherPage = () => {
    const { id } = useParams();
    const teacherId = typeof id === 'string' ? Number(id) : 0;
    const role = localStorage.getItem("role");
    useEffect(() => {
        if (!id) return;
        const teacherId = typeof id === 'string' ? Number(id) : 0;

        const fetchData = async () => {
            // try {
            //     // Lấy thông tin giáo viên
            //     const teacherRes = await getOneTeachers(teacherId);
            //     console.log("teacher>>", teacherRes)
            //     setTeacher(teacherRes);

            //     // Lấy danh sách bài giảng
            //     const lessonData = await getLessonsByTeacherid(teacherId);
            //     setAllLessonById(lessonData);
            // } catch (error) {
            //     console.error("Lỗi khi lấy dữ liệu:", error);
            // }
        };

        fetchData();
    }, [id]);

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-white py-6 px-4 rounded-md flex-1 flex gap-4 ">
                        <div className="w-30 mr-4 aspect-square">
                            <FaUserCircle className="w-full h-full  text-gray-900/50" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{"Trần đình thái"}</h1>
                            </div>
                            <p className="text-sm text-gray-500">

                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <FaAdn />
                                    <span>{"a"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <FaAdn />
                                    <span>{"b"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <FaAdn />
                                    <span>{"c"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <FaAdn />
                                    <span>{"d"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SMALL CARDS */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleAttendance.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">3</h1>
                                <span className="text-sm text-gray-400">Học phần</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleBranch.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">9</h1>
                                <span className="text-sm text-gray-400">Bài giảng</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleLesson.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">6</h1>
                                <span className="text-sm text-gray-400">Lớp</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleClass.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">6</h1>
                                <span className="text-sm text-gray-400">Classes</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4 h-auto">
                    <h1>Thời khóa biểu</h1>
                    {/* <BigCalendar events={lessons} /> */}
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md h-full">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
                            Teacher&apos;s Classes
                        </Link>
                        <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
                            Teacher&apos;s Students
                        </Link>
                        <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
                            Teacher&apos;s Lessons
                        </Link>
                        <Link className="p-3 rounded-md bg-pink-50" href="/">
                            Teacher&apos;s Exams
                        </Link>
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
                            Teacher&apos;s Assignments
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SingleTeacherPage;
