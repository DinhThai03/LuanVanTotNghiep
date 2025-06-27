// services/semester-subject.ts
import axios from "@/lib/Axios";

// Lấy danh sách môn học theo học kỳ và khoa (tùy chọn)
export const getSemesterSubjects = async (faculty_id?: number, semester_id?: number) => {
    const res = await axios.get("/api/semester_subjects", {
        params: {
            faculty_id,
            semester_id,
        },
    });
    return res.data;
};

// Lấy môn học trong học kỳ để dùng cho lesson
export const getSubjectsForLesson = async (semester_id?: number) => {
    const res = await axios.get(`/api/semester/${semester_id}/subjects-forlesson`);
    return res.data;
};

// Lấy tất cả môn học trong học kỳ
export const getSubjectsFromSemester = async (semester_id: number) => {
    const res = await axios.get(`/api/semester/${semester_id}/subjects`);
    return res.data;
};

// Thêm môn học cho học kỳ
export const addSemesterSubject = async (semester_subject: FormData) => {
    const res = await axios.post("/api/semester_subject", semester_subject);
    return res;
};

// Cập nhật hoặc thêm nhiều môn học cùng lúc
export const storeOrUpdateSemesterSubjects = async (semester_subject: FormData) => {
    const res = await axios.post("/api/semester-subjects/update", semester_subject);
    return res;
};

// Cập nhật môn học cho học kỳ
export const updateSemesterSubject = async (id: number, semester_subject: FormData) => {
    const res = await axios.post(`/api/semester_subject/${id}`, semester_subject);
    return res;
};

// Xoá môn học khỏi học kỳ
export const deleteSemesterSubject = async (id: number) => {
    const res = await axios.delete(`/api/semester_subject/${id}`);
    return res.data;
};
