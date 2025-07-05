"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CourseGroup } from "@/components/course-group";
import { getLessonsGroupedBySubject } from "@/services/Lesson";
import { registerLessons } from "@/services/Registration";
import { Lecture } from "@/types/LessonType";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function RegisterCoursePage() {
    const [selectedLectures, setSelectedLectures] = useState<Record<string, number | undefined>>({});
    const [subjectLectures, setSubjectLectures] = useState<Record<string, Lecture[]>>({});
    const [result, setResult] = useState<{ registered: any[]; skipped: any[] }>({
        registered: [],
        skipped: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getLessonsGroupedBySubject({
                    student_code: "DH52100124",
                    semester_id: 3,
                    faculty_id: 1,
                    year: 1,
                });
                setSubjectLectures(res);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu bài giảng:", err);
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
        try {
            const filteredSelections = Object.fromEntries(
                Object.entries(selectedLectures).filter(([_, v]) => v !== undefined) as [string, number][]
            );

            const res = await registerLessons("DH52100124", 3, filteredSelections);


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
            let message;
            console.error("Chi tiết lỗi", axiosErr.response?.data);

            if (axiosErr.response?.data?.message) {
                message = (axiosErr.response.data.message);
            } else if (axiosErr.response?.data?.error) {
                message = (axiosErr.response.data.error);
            }
            else if (axiosErr.message === "Network Error") {
                message = ("Không thể kết nối đến server.");
            } else {
                message = ("Đã có lỗi xảy ra khi đăng ký.");
            }

            console.error("Lỗi khi đăng ký:", err);
            toast.error(message, {
                description: "Vui lòng kiểm tra lại",
            });
        }
    };

    return (
        <ScrollArea className="bg-white w-full mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Đăng ký bài giảng</h1>

            <div className="space-y-8">
                {Object.entries(subjectLectures).map(([subjectCode, lectures]) => (
                    <CourseGroup
                        key={subjectCode}
                        subjectCode={subjectCode}
                        subjectName={lectures[0]?.teacher_subject.subject.name ?? subjectCode}
                        lectures={lectures}
                        onSelectLecture={(subjectCode, lectureId) =>
                            handleSelectLecture(subjectCode, lectureId)
                        }
                    />
                ))}
            </div>

            <div className="mt-6">
                {/* <h2 className="font-medium">Các bài giảng đã chọn:</h2>
                <ul className="list-disc list-inside">
                    {selectedLectureIds.map((id) => (
                        <li key={id}>ID: {id}</li>
                    ))}
                </ul> */}

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
                                    <li key={index}>
                                        {item.subject_name}
                                    </li>
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
        </ScrollArea>
    );
}
