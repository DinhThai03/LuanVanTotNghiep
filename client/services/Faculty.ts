import axios from "./Axios";
import Cookies from "js-cookie";

export const getFacultys = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/facultys`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addFaculty = async (faculty: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/faculty`, faculty, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateFaculty = async (id: number, faculty: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/faculty/${id}`, faculty, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteFaculty = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/faculty/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}