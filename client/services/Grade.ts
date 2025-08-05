// services/grade.ts
import axios from "@/lib/Axios";

export const getGrades = async (
    academicYearId?: number,
    semesterId?: number,
    classId?: number,
    lessonId?: number
) => {
    const params: any = {};

    if (academicYearId) params.academic_year_id = academicYearId;
    if (semesterId) params.semester_id = semesterId;
    if (classId) params.class_id = classId;
    if (lessonId) params.lesson_id = lessonId;

    const res = await axios.get("/api/grades", { params });
    return res.data;
};

export const getStudentGrades = async (user_id: number) => {
    const res = await axios.get(`/api/students/${user_id}/grades`);
    return res.data;
};


export const addGrade = async (grade: FormData) => {
    const res = await axios.post("/api/grade", grade);
    return res;
};

export const updateGrade = async (id: number, grade: FormData) => {
    const res = await axios.post(`/api/grade/${id}`, grade);
    return res;
};

export const deleteGrade = async (id: number) => {
    const res = await axios.delete(`/api/grade/${id}`);
    return res.data;
};

export const importGrades = async (formData: FormData, lesson_id?: number) => {
    const res = await axios.post("/api/grades/import", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        params: {
            lesson_id
        }
    });
    return res.data;

};

export const getGradeByLesson = async (lesson_id: number) => {
    const res = await axios.get(`/api/grades/lesson/${lesson_id}`);
    return res.data;
};