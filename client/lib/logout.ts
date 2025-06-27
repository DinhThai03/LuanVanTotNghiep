import Cookies from "js-cookie";

export const logout = async () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/login";
};
