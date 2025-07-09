import { getLessons } from '@/services/Lesson';
// services/student.ts
import axios from "@/lib/Axios";

// Lấy danh sách sinh viên
export const getStudents = async () => {
    const res = await axios.get("/api/students");
    return res.data;
};

// Lấy 1 sinh viên
export const getOneStudent = async (user_id: number) => {
    const res = await axios.get(`/api/student/${user_id}`);
    return res.data;
};

export const getStudentInfo = async (user_id: number) => {
    const res = await axios.get(`/api/students/${user_id}/info`);
    return res.data;
};

// Thêm sinh viên
export const addStudent = async (student: FormData) => {
    const res = await axios.post("/api/student", student);
    return res;
};

// Cập nhật thông tin sinh viên
export const updateStudent = async (code: string, student: FormData) => {
    const res = await axios.post(`/api/student/${code}`, student);
    return res;
};

// Xoá sinh viên
export const deleteStudent = async (code: string) => {
    const res = await axios.delete(`/api/student/${code}`);
    return res.data;
};


export const importStudent = async (formData: FormData) => {
    const res = await axios.post("/api/students/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;

};