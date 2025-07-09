import axios from "@/lib/Axios";

export const getRegistrationPeriods = async (semester_id: number) => {
    const res = await axios.get("/api/registration_periods", {
        params: { semester_id }
    });
    return res.data;
};

export const getSemesterInPeriod = async () => {
    const res = await axios.get("/api/CurrentSemester/registration_period");
    return res.data;
};

export const addRegistrationPeriod = async (registration_period: FormData) => {
    const res = await axios.post("/api/registration-periods/bulk", registration_period);
    return res;
};

export const updateRegistrationPeriod = async (id: number, registration_period: FormData) => {
    const res = await axios.post(`/api/registration_period/${id}`, registration_period);
    return res;
};

export const deleteRegistrationPeriod = async (id: number) => {
    const res = await axios.delete(`/api/registration_period/${id}`);
    return res.data;
};
