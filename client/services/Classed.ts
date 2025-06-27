// services/classed.ts
import axios from "@/lib/Axios";

// Lấy danh sách lớp (lọc theo khoa nếu có)
export const getClasseds = async (faculty_id?: number) => {
    const res = await axios.get("/api/classed", {
        params: {
            faculty: faculty_id,
        },
    });

    return res.data;
};

// Thêm lớp mới
export const addClassed = async (classed: FormData) => {
    const res = await axios.post("/api/class", classed);
    return res;
};

// Cập nhật lớp
export const updateClassed = async (id: number, classed: FormData) => {
    const res = await axios.post(`/api/class/${id}`, classed);
    return res;
};

// Xoá lớp
export const deleteClassed = async (id: number) => {
    const res = await axios.delete(`/api/class/${id}`);
    return res.data;
};
