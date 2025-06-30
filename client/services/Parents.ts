import axios from "@/lib/Axios";

export const getParents = async () => {
    const res = await axios.get("/api/guardians");
    return res.data;
};

export const getParentByStudentCode = async (code: string) => {
    const res = await axios.get(`/api/student/${code}/guardian`);
    return res.data;
};

export const addParent = async (guardian: FormData) => {
    const res = await axios.post("/api/guardian", guardian);
    return res;
};

export const updateParent = async (id: number, guardian: FormData) => {
    const res = await axios.post(`/api/guardian/${id}`, guardian);
    return res;
};

export const deleteParent = async (id: number) => {
    const res = await axios.delete(`/api/guardian/${id}`);
    return res.data;
};
