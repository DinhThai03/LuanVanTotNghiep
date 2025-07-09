"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CourseGroup } from "@/components/course-group";
import { getLessonsGroupedBySubject } from "@/services/Lesson";
import { registerLessons } from "@/services/Registration";
import { Lecture } from "@/types/LessonType";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { SemesterData } from "@/types/SemesterType";
import { getSemesterInPeriod } from "@/services/RegistrationPeriod";
import { IoAlertCircle } from "react-icons/io5";
import { getStudentInfo } from "@/services/Student";
import { profile } from "@/features/auth/api";
import { StudentSummary } from "@/types/StudentType";

export default function RegisterCoursePage() {
    const [loading, setLoading] = useState(true);
    const [semester, setSemester] = useState<SemesterData>();
    const [student, setStudent] = useState<StudentSummary>();

    const [selectedLectures, setSelectedLectures] = useState<Record<string, number | undefined>>({});
    const [subjectLectures, setSubjectLectures] = useState<Record<string, Lecture[]>>({});
    const [result, setResult] = useState<{ registered: any[]; skipped: any[] }>({
        registered: [],
        skipped: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sRes = await getSemesterInPeriod();
                setSemester(sRes);

                if (sRes?.id) {
                    const info = await profile();
                    const studentRes = await getStudentInfo(info.id);
                    if (studentRes) {
                        setStudent(studentRes);
                        const lessons = await getLessonsGroupedBySubject({
                            semester_id: sRes.id,
                            faculty_id: studentRes.faculty_id,
                            year: studentRes.year,
                        });
                        setSubjectLectures(lessons);
                    }

                }
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu bài giảng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSelectLecture = (subjectCode: string, lectureId: number | undefined) => {
        setSelectedLectures((prev) => ({
            ...prev,
            [subjectCode]: lectureId,
        }));
    };

    const selectedLectureIds = Object.values(selectedLectures).filter(
        (id): id is number => id !== undefined
    );

    const handleRegister = async () => {
        if (!student || !semester) {
            toast.error("Thông tin bị thiếu");
            return;
        }
        try {

            const filteredSelections = Object.fromEntries(
                Object.entries(selectedLectures).filter(([_, v]) => v !== undefined) as [string, number][]
            );

            const res = await registerLessons(student?.student_code, semester?.id!, filteredSelections);

            toast.success("Đăng ký bài giảng thành công!");

            if (res.skipped?.length > 0) {
                toast.warning(`Có ${res.skipped.length} bài giảng không thể đăng ký.`);
            }

            setResult({
                registered: res.registered || [],
                skipped: res.skipped || [],
            });
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            let message = "Đã có lỗi xảy ra khi đăng ký.";

            if (axiosErr.response?.data?.message) {
                message = axiosErr.response.data.message;
            } else if (axiosErr.response?.data?.error) {
                message = axiosErr.response.data.error;
            } else if (axiosErr.message === "Network Error") {
                message = "Không thể kết nối đến server.";
            }

            console.error("Lỗi khi đăng ký:", err);
            toast.error(message, {
                description: "Vui lòng kiểm tra lại",
            });
        }
    };

    return (
        <ScrollArea className="bg-white w-full p-8">
            <h1 className="text-2xl font-bold mb-6">Đăng ký bài giảng</h1>

            {loading ? (
                <div className="text-center text-gray-600">Đang tải dữ liệu...</div>
            ) : semester ? Object.keys(subjectLectures).length !== 0 ? (
                <>
                    <div className="space-y-8">
                        {Object.entries(subjectLectures).map(([subjectCode, lectures]) => (
                            <CourseGroup
                                key={subjectCode}
                                subjectCode={subjectCode}
                                subjectName={lectures[0]?.teacher_subject.subject.name ?? subjectCode}
                                lectures={lectures}
                                onSelectLecture={handleSelectLecture}
                            />
                        ))}
                    </div>
                    <div className='[zoom:0.6] md:[zoom:1]'>
                        <div className="mt-6">
                            <button
                                onClick={handleRegister}
                                disabled={selectedLectureIds.length === 0}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                Đăng ký bài giảng
                            </button>
                        </div>

                        {(result.registered.length > 0 || result.skipped.length > 0) && (
                            <div className="mt-8">
                                {result.registered.length > 0 && (
                                    <>
                                        <h2 className="font-semibold text-green-700">Đã đăng ký:</h2>
                                        <ul className="list-disc list-inside mb-4">
                                            {result.registered.map((item, index) => (
                                                <li key={index}>{item.subject_name}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {result.skipped.length > 0 && (
                                    <>
                                        <h2 className="font-semibold text-red-700">Bị bỏ qua:</h2>
                                        <ul className="list-disc list-inside">
                                            {result.skipped.map((item, index) => (
                                                <li key={index}>
                                                    ID: {item.lesson_id} – {item.subject_name} ({item.reason})
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                </>
            ) : (<div className='flex items-center justify-center text-red-700 font-medium text-sm md:text-base p-4 w-fit mx-auto my-6 gap-2'>Không có bài giảng nào</div>) :
                (
                    <div className="flex items-center justify-center bg-red-100 text-red-700 font-medium text-sm md:text-base rounded-lg shadow p-4 w-fit mx-auto my-6 gap-2">
                        <IoAlertCircle className="text-xl" />
                        Hiện tại không trong thời gian đăng ký
                    </div>
                )}
        </ScrollArea>
    );
}
