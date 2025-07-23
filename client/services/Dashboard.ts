import axios from "@/lib/Axios";

export const getDashboardStats = async (academic_year_id: number, semester_id: number) => {
    const res = await axios.post("/api/dashboard/stats", {
        academic_year_id,
        semester_id,
    });
    return res.data;
};


