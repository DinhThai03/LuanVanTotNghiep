// services/lesson.ts
import axios from "@/lib/Axios";

// Lấy danh sách buổi học
export const getLessons = async () => {
    const res = await axios.get("/api/lessons");
    return res.data;
};

// Thêm buổi học
export const addLesson = async (lesson: FormData) => {
    const res = await axios.post("/api/lesson", lesson);
    return res;
};

// Cập nhật buổi học
export const updateLesson = async (id: number, lesson: FormData) => {
    const res = await axios.post(`/api/lesson/${id}`, lesson);
    return res;
};

// Xoá buổi học
export const deleteLesson = async (id: number) => {
    const res = await axios.delete(`/api/lesson/${id}`);
    return res.data;
};
