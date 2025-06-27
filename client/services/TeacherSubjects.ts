// services/teacher-subject.ts
import axios from "@/lib/Axios";

// Lấy danh sách môn giảng dạy của giảng viên
export const getTeacherSubjects = async () => {
    const res = await axios.get("/api/teacher_subjects");
    return res.data;
};

// Thêm môn giảng dạy cho giảng viên
export const addTeacherSubject = async (teacher_subject: FormData) => {
    const res = await axios.post("/api/teacher_subject", teacher_subject);
    return res;
};

// Cập nhật môn giảng dạy cho giảng viên
export const updateTeacherSubject = async (code: string, teacher_subject: FormData) => {
    const res = await axios.post(`/api/teacher_subject/${code}`, teacher_subject);
    return res;
};

// Xoá môn giảng dạy
export const deleteTeacherSubject = async (code: string) => {
    const res = await axios.delete(`/api/teacher_subject/${code}`);
    return res.data;
};
