import axios from "@/lib/Axios";


// Cập nhật 
export const updateUser = async (id: number, user: FormData) => {
    const res = await axios.post(`/api/user/${id}`, user);
    return res;
};
