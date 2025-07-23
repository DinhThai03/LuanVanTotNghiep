import axios from "@/lib/Axios";

export const getGraduationList = async (cohort_id: number, faculty_id: number) => {
    const res = await axios.get(`/api/graduation/list`, { params: { cohort_id, faculty_id } });
    return res.data;
};
