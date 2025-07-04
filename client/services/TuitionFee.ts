// services/tuition_fee.ts
import axios from "@/lib/Axios";

export const getTuitionFees = async () => {
    const res = await axios.get("/api/tuition_fees");
    return res.data;
};

export const getStudentTuitionFee = async (code: string, semester_id?: number) => {
    const res = await axios.get(`/api/tuition_fees/${code}`, {
        params: semester_id ? { semester_id: semester_id } : {}
    });
    return res.data;
};

export const addTuitionFee = async (tuition_fee: FormData) => {
    const res = await axios.post("/api/tuition_fee", tuition_fee);
    return res;
};

export const updateTuitionFee = async (code: string, tuition_fee: FormData) => {
    const res = await axios.post(`/api/tuition_fee/${code}`, tuition_fee);
    return res;
};

export const deleteTuitionFee = async (code: string) => {
    const res = await axios.delete(`/api/tuition_fee/${code}`);
    return res.data;
};

export const createMomoPayment = async (
    tuition_fee_ids: number[],
    total_amount: number
) => {
    const res = await axios.post("/api/payment/momo",
        {
            tuition_fee_ids,
            total_amount,
        }
    );

    return res.data;
};
