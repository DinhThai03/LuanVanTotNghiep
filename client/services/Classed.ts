import axios from "./Axios";
import Cookies from "js-cookie";

export const getClasseds = async (faculty_id?: number) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.get('/api/classed', {
        params: {
            faculty: faculty_id,
        },
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res.data;
};


export const addClassed = async (classed: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/class`, classed, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateClassed = async (id: number, classed: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/class/${id}`, classed, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteClassed = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/class/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}