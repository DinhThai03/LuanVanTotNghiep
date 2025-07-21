import axios from "@/lib/Axios";

export const getExamSchedules = async () => {
    const res = await axios.get("/api/exam_schedules");
    return res.data;
};

export const getStudentExamSchedules = async (student_id: number, semester_id: number) => {
    const res = await axios.get(`/api/exam-schedules/student/${student_id}/semester/${semester_id}`);
    return res.data;
};


export const addExamSchedule = async (exam_schedule: FormData) => {
    const res = await axios.post("/api/exam_schedule", exam_schedule);
    return res;
};

export const updateExamSchedule = async (id: number, exam_schedule: FormData) => {
    const res = await axios.post(`/api/exam_schedule/${id}`, exam_schedule);
    return res;
};

export const deleteExamSchedule = async (id: number) => {
    const res = await axios.delete(`/api/exam_schedule/${id}`);
    return res.data;
};
