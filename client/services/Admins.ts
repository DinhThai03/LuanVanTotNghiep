import axios from "./Axios";
import Cookies from "js-cookie";

export const getAdmins = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(
        `/api/admins`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}

export const addAdmin = async (admin: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/admin`, admin, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateAdmin = async (admin_id: number, admin: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/admin/${admin_id}`, admin, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteAdmin = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}