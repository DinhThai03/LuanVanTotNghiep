// services/room.ts
import axios from "@/lib/Axios";

// Lấy danh sách phòng
export const getRooms = async () => {
    const res = await axios.get("/api/rooms");
    return res.data;
};

// Thêm phòng mới
export const addRoom = async (room: FormData) => {
    const res = await axios.post("/api/room", room);
    return res;
};

// Cập nhật phòng
export const updateRoom = async (id: number, room: FormData) => {
    const res = await axios.post(`/api/room/${id}`, room);
    return res;
};

// Xoá phòng
export const deleteRoom = async (id: number) => {
    const res = await axios.delete(`/api/room/${id}`);
    return res.data;
};
