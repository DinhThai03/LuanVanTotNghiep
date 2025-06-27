import axios from "@/lib/Axios";
import Cookies from "js-cookie";

export const login = async (username: string, password: string) => {
    const res = await axios.post("/api/auth/login", { username, password });
    const { access_token, refresh_token } = res.data;
    Cookies.set("access_token", access_token);
    Cookies.set("refresh_token", refresh_token);
    console.log("a", refresh_token);

    return res.data;
};

export const profile = async () => {
    const res = await axios.get("/api/auth/profile");
    return res.data;
};
