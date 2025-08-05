import axios from "@/lib/Axios";

export const getDashboardStats = async (academic_year_id: number, faculty_id: number) => {
    const res = await axios.post("/api/dashboard/stats", {}, {
        params: {
            academic_year_id,
            faculty_id,
        }
    });
    return res.data;
};


