// services/teacher.ts
import axios from "@/lib/Axios";

// Lấy danh sách giảng viên
export const getTeachers = async () => {
    const res = await axios.get("/api/teachers");
    return res.data;
};

export const getOneTeachers = async (teacher_id: number) => {
    const res = await axios.get(`/api/teacher_byId/${teacher_id}`);
    return res.data;
};

export const getTeacherInfo = async (teacher_id: number) => {
    const res = await axios.get(`/api/teachers/info/${teacher_id}`);
    return res.data;
};

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

export const importTeachers = async (formData: FormData) => {
    const res = await axios.post("/api/teachers/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;

};