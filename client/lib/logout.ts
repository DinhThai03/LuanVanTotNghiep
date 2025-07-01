import axios from './Axios';
import Cookies from "js-cookie";

export const logout = async () => {
    await axios.post(`api/auth/logout`);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/login";
};
