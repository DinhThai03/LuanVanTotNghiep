// services/registration.ts
import axios from "@/lib/Axios";

export const getRegistrations = async (
    faculty_id?: number,
    class_id?: number,
    semester_id?: number
) => {
    const res = await axios.get("/api/registrations", {
        params: {
            ...(faculty_id && { faculty_id }),
            ...(class_id && { class_id }),
            ...(semester_id && { semester_id }),
        },
    });
    return res.data;
};


// Thêm buổi học
export const addRegistration = async (registration: FormData) => {
    const res = await axios.post("/api/registration", registration);
    return res;
};

// Cập nhật buổi học
export const updateRegistration = async (id: number, registration: FormData) => {
    const res = await axios.post(`/api/registration/${id}`, registration);
    return res;
};

// Xoá buổi học
export const deleteRegistration = async (id: number) => {
    const res = await axios.delete(`/api/registration/${id}`);
    return res.data;
};
