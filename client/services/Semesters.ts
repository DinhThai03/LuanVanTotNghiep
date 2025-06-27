// services/semester.ts
import axios from "@/lib/Axios";

// Lấy danh sách học kỳ
export const getSemesters = async () => {
    const res = await axios.get("/api/semesters");
    return res.data;
};

// Thêm học kỳ mới
export const addSemester = async (semester: FormData) => {
    const res = await axios.post("/api/semester", semester);
    return res;
};

// Cập nhật học kỳ
export const updateSemester = async (id: number, semester: FormData) => {
    const res = await axios.post(`/api/semester/${id}`, semester);
    return res;
};

// Xoá học kỳ
export const deleteSemester = async (id: number) => {
    const res = await axios.delete(`/api/semester/${id}`);
    return res.data;
};
