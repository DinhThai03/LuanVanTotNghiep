// services/teacher.ts
import axios from "@/lib/Axios";

// Lấy danh sách giảng viên
export const getTeachers = async () => {
    const res = await axios.get("/api/teachers");
    return res.data;
};

// Thêm giảng viên mới
export const addTeacher = async (teacher: FormData) => {
    const res = await axios.post("/api/teacher", teacher);
    return res;
};

// Cập nhật giảng viên
export const updateTeacher = async (code: string, teacher: FormData) => {
    const res = await axios.post(`/api/teacher/${code}`, teacher);
    return res;
};

// Xoá giảng viên
export const deleteTeacher = async (code: string) => {
    const res = await axios.delete(`/api/teacher/${code}`);
    return res.data;
};
