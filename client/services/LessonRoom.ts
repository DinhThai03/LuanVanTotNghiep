// services/lesson-room.ts
import axios from "@/lib/Axios";

// Lấy danh sách phòng học cho buổi học
export const getLessonRooms = async () => {
    const res = await axios.get("/api/lesson_rooms");
    return res.data;
};

// Thêm mới phòng học cho buổi học
export const addLessonRoom = async (lesson_room: FormData) => {
    const res = await axios.post("/api/lesson_room", lesson_room);
    return res;
};

// Cập nhật phòng học
export const updateLessonRoom = async (id: number, lesson_room: FormData) => {
    const res = await axios.post(`/api/lesson_room/${id}`, lesson_room);
    return res;
};

// Xoá phòng học khỏi buổi học
export const deleteLessonRoom = async (id: number) => {
    const res = await axios.delete(`/api/lesson_room/${id}`);
    return res.data;
};
