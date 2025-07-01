import axios from "@/lib/Axios";

export const getCohorts = async () => {
    const res = await axios.get("/api/cohorts");
    return res.data;
};

export const addCohort = async (cohorts: FormData) => {
    const res = await axios.post("/api/cohorts", cohorts);
    return res;
};

export const updateCohort = async (id: number, cohorts: FormData) => {
    const res = await axios.post(`/api/cohorts/${id}`, cohorts);
    return res;
};

export const deleteCohort = async (id: number) => {
    const res = await axios.delete(`/api/cohorts/${id}`);
    return res.data;
};
