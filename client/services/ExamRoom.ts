import axios from "@/lib/Axios";

export const getExamRooms = async () => {
    const res = await axios.get("/api/exam_classrooms");
    return res.data;
};


export const addExamRoom = async (exam_classroom: FormData) => {
    const res = await axios.post("/api/exam_classroom", exam_classroom);
    return res;
};

export const updateExamRoom = async (id: number, exam_classroom: FormData) => {
    const res = await axios.post(`/api/exam_classroom/${id}`, exam_classroom);
    return res;
};

export const deleteExamRoom = async (id: number) => {
    const res = await axios.delete(`/api/exam_classroom/${id}`);
    return res.data;
};
