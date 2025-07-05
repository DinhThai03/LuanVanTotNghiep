import axios from "@/lib/Axios";

export const getDashboardStats = async (params?: {
    academic_year_id?: number;
    semester_id?: number;
}) => {
    const res = await axios.get("/api/dashboard/stats", {
        params,
    });
    return res.data;
};
