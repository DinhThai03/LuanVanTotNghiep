import axios from "@/lib/Axios";

export const getRequiredCredits = async (cohort_id: number) => {
    const res = await axios.get("/api/required_credits", {
        params: { cohort_id },
    });
    return res.data;
};


export const addRequiredCredit = async (required_credits: FormData) => {
    const res = await axios.post("/api/required_credits", required_credits);
    return res;
};

export const updateRequiredCredit = async (id: number, required_credits: FormData) => {
    const res = await axios.post(`/api/required_credits/${id}`, required_credits);
    return res;
};

export const deleteRequiredCredit = async (id: number) => {
    const res = await axios.delete(`/api/required_credits/${id}`);
    return res.data;
};
