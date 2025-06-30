import axios from "@/lib/Axios";

export const getAttendances = async (code: string) => {
    const res = await axios.get(`/api/student-registrations/approved`, {
        params: { code },
    });
    return res.data;
};

