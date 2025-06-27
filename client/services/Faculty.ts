// services/faculty.ts
import axios from "@/lib/Axios";

// Lấy danh sách khoa
export const getFacultys = async () => {
    const res = await axios.get("/api/facultys");
    return res.data;
};

// Thêm khoa mới
export const addFaculty = async (faculty: FormData) => {
    const res = await axios.post("/api/faculty", faculty);
    return res;
};

// Cập nhật khoa
export const updateFaculty = async (id: number, faculty: FormData) => {
    const res = await axios.post(`/api/faculty/${id}`, faculty);
    return res;
};

// Xoá khoa
export const deleteFaculty = async (id: number) => {
    const res = await axios.delete(`/api/faculty/${id}`);
    return res.data;
};
