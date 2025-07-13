// services/subject.ts
import axios from "@/lib/Axios";

// Lấy danh sách tất cả môn học
export const getSubjects = async () => {
    const res = await axios.get("/api/subjects");
    return res.data;
};

// Lấy danh sách môn học theo khoa
export const getSubjectsByFaculty = async (faculty_id: number) => {
    const res = await axios.get(`/api/faculties/${faculty_id}/all-subjects`);
    return res.data;
};

// Thêm môn học mới
export const addSubject = async (subject: FormData) => {
    const res = await axios.post("/api/subject", subject, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res;
};

// Cập nhật môn học
export const updateSubject = async (id: number, subject: FormData) => {
    const res = await axios.post(`/api/subject/${id}`, subject, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res;
};

// Xoá môn học
export const deleteSubject = async (id: number) => {
    const res = await axios.delete(`/api/subject/${id}`);
    return res.data;
};

export const importSubjects = async (formData: FormData) => {
    const res = await axios.post("/api/subjects/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;

};