import axios from "@/lib/Axios";

export const getCreditPrices = async () => {
    const res = await axios.get("/api/credit_prices");
    return res.data;
};

export const addCreditPrice = async (credit_price: FormData) => {
    const res = await axios.post("/api/credit_price", credit_price);
    return res;
};

export const updateCreditPrice = async (id: number, credit_price: FormData) => {
    const res = await axios.post(`/api/credit_price/${id}`, credit_price);
    return res;
};

export const deleteCreditPrice = async (id: number) => {
    const res = await axios.delete(`/api/credit_price/${id}`);
    return res.data;
};
