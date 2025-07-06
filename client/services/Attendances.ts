import axios from "@/lib/Axios";

export const getAttendances = async (code: string) => {
    const res = await axios.get(`/api/student-registrations/approved`, {
        params: { code },
    });
    return res.data;
};

export const getTeacherAttendances = async (teacher_code: string) => {
    const res = await axios.get(`/api/lessons/teacher`, {
        params: { teacher_code },
    });
    return res.data;
};

