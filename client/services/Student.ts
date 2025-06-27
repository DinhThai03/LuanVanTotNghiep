// services/student.ts
import axios from "@/lib/Axios";

// Lấy danh sách sinh viên
export const getStudents = async () => {
    const res = await axios.get("/api/students");
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
