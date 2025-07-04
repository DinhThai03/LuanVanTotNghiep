"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { profile } from "@/features/auth/api";
import { getStudentGrades } from "@/services/Grade";
import { getOneParents } from "@/services/Parents";
import { SemesterGrade } from "@/types/GradeType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function GradeTable() {
    const [grades, setGrades] = useState<SemesterGrade[]>([]);
    const [userId, setUserId] = useState<number>();
    const [name, setName] = useState<string>();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await profile();

                if (!res?.role) {
                    toast.error("Không xác định được vai trò người dùng");
                    return;
                }

                if (res.role === "student") {
                    setUserId(res.id);
                    setName(`${res.last_name} ${res.first_name}`);
                } else if (res.role === "parent") {
                    const pRes = await getOneParents(res.id);
                    const student = pRes?.data?.student;

                    if (student?.user_id) {
                        setUserId(student.user_id);
                        setName(`${student.user.last_name} ${student.user.first_name}`);
                    } else {
                        toast.error("Không tìm thấy thông tin sinh viên của phụ huynh");
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Lỗi khi tải thông tin người dùng");
            }
        };

        fetchInfo();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchGrades = async () => {
            try {
                const data = await getStudentGrades(userId);
                setGrades(data);
            } catch (err) {
                console.error(err);
                toast.error("Lỗi khi tải bảng điểm");
            }
        };

        fetchGrades();
    }, [userId]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 [zoom:0.4] md:[zoom:0.7] lg:[zoom:0.8] xl:[zoom:1]">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">
                Bảng điểm sinh viên: <span className="text-red-600">{name}</span>
            </h1>

            {grades.map((semester) => (
                <div key={semester.semester_name} className="mb-10">
                    <h2 className="text-lg font-bold text-gray-700 mb-3">
                        {semester.semester_name} - Năm học {semester.academic_year_name}
                    </h2>

                    <div className="border rounded-md shadow-sm overflow-x-auto bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 text-sm text-gray-700">
                                    <TableHead className="text-center w-[50px]">STT</TableHead>
                                    <TableHead className="text-center w-[100px]">Mã Môn</TableHead>
                                    <TableHead className="min-w-[200px]">Tên Môn</TableHead>
                                    <TableHead className="text-center w-[50px]">TC</TableHead>
                                    <TableHead className="text-center w-[50px">%QT</TableHead>
                                    <TableHead className="text-center w-[50px">%GK</TableHead>
                                    <TableHead className="text-center w-[60px]">QT</TableHead>
                                    <TableHead className="text-center w-[60px]">GK</TableHead>
                                    <TableHead className="text-center w-[80px]">Điểm Thi</TableHead>
                                    <TableHead className="text-center w-[80px]">Điểm TK</TableHead>
                                    <TableHead className="text-center w-[80px]">Chữ</TableHead>
                                    <TableHead className="text-center w-[80px]">KQ</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {semester.grades.map((grade) => (
                                    <TableRow
                                        key={grade.stt}
                                        className="hover:bg-gray-50 text-sm text-gray-700"
                                    >
                                        <TableCell className="text-center">{grade.stt}</TableCell>
                                        <TableCell className="text-center">{grade.subject_code}</TableCell>
                                        <TableCell>{grade.subject_name}</TableCell>
                                        <TableCell className="text-center">{grade.credit}</TableCell>
                                        <TableCell className="text-center">{grade.process_percent}</TableCell>
                                        <TableCell className="text-center">{grade.midterm_percent}</TableCell>
                                        <TableCell className="text-center">{grade.process_score}</TableCell>
                                        <TableCell className="text-center">{grade.midterm_score}</TableCell>
                                        <TableCell className="text-center">{grade.final_score}</TableCell>
                                        <TableCell className="text-center font-semibold">{grade.average_score}</TableCell>
                                        <TableCell className="text-center">{grade.letter_grade}</TableCell>
                                        <TableCell
                                            className={`text-center font-medium ${grade.result ? grade.result == 1 ? "text-green-600" : "text-red-500" : ""}`}
                                        >
                                            {grade.result ? grade.result == 1 ? "Đạt" : "Không đạt" : ""}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ))}
        </div>
    );
}
