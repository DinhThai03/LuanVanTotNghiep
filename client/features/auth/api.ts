import ax from "@/lib/Axios";
import axios from "axios";
import Cookies from "js-cookie";

export const login = async (username: string, password: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { username, password });
    const { access_token, refresh_token } = res.data;
    Cookies.set("access_token", access_token);
    Cookies.set("refresh_token", refresh_token);
    return res.data;
};


export const forgotPassword = async (email: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, { email });
    return res.data;
};

export const resetPassword = async (formData: FormData) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};


export const profile = async () => {
    const res = await ax.get("/api/auth/profile");
    return res.data;
};

export const changePassword = async (data: FormData) => {
    const res = await ax.post("/api/auth/change_password", data);
    return res.data;
};

export const resetDefaultPassword = async (user_id: number) => {
    const res = await ax.post("/api/auth/reset_default_password", { user_id });
    return res.data;
};
