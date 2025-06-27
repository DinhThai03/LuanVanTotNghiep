import axios from "../lib/Axios";

export const getAdmins = async () => {
    const res = await axios.get("/api/admins");
    return res.data;
};

export const addAdmin = async (admin: FormData) => {
    const res = await axios.post("/api/admin", admin);
    return res;
};

export const updateAdmin = async (admin_id: number, admin: FormData) => {
    const res = await axios.post(`/api/admin/${admin_id}`, admin);
    return res;
};

export const deleteAdmin = async (id: number) => {
    const res = await axios.delete(`/api/admin/${id}`);
    return res.data;
};
