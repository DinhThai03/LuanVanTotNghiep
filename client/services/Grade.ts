// services/grade.ts
import axios from "@/lib/Axios";

// Lấy danh sách giảng viên

export const getGrades = async (
    academicYearId?: number,
    semesterId?: number,
    classId?: number,
    lessonId?: number
) => {
    const params: any = {};

    if (academicYearId) params.academic_year_id = academicYearId;
    if (semesterId) params.semester_id = semesterId;
    if (classId) params.class_id = classId;
    if (lessonId) params.lesson_id = lessonId;

    const res = await axios.get("/api/grades", { params });
    return res.data;
};

export const getStudentGrades = async (user_id: number) => {
    const res = await axios.get(`/api/students/${user_id}/grades`);
    return res.data;
};


// Thêm giảng viên mới
export const addGrade = async (grade: FormData) => {
    const res = await axios.post("/api/grade", grade);
    return res;
};

// Cập nhật giảng viên
export const updateGrade = async (id: number, grade: FormData) => {
    const res = await axios.post(`/api/grade/${id}`, grade);
    return res;
};

// Xoá giảng viên
export const deleteGrade = async (id: number) => {
    const res = await axios.delete(`/api/grade/${id}`);
    return res.data;
};
