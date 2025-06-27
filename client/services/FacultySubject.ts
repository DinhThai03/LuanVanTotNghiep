// services/faculty-subject.ts
import axios from "@/lib/Axios"; // Đã có interceptor tự động gắn Authorization và Accept

// Lấy danh sách môn theo khoa
export const getFacultySubjects = async () => {
    const res = await axios.get("/api/faculty_subjects");
    return res.data;
};

// Thêm môn học cho khoa
export const addFacultySubject = async (faculty_subject: FormData) => {
    const res = await axios.post("/api/faculty_subject", faculty_subject);
    return res;
};

// Cập nhật môn học theo khoa
export const updateFacultySubject = async (id: number, faculty_subject: FormData) => {
    const res = await axios.post(`/api/faculty_subject/${id}`, faculty_subject);
    return res;
};

// Xoá môn học theo khoa
export const deleteFacultySubject = async (id: number) => {
    const res = await axios.delete(`/api/faculty_subject/${id}`);
    return res.data;
};
