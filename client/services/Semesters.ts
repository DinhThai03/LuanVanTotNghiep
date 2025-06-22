import axios from "./Axios";
import Cookies from "js-cookie";

export const getSemesters = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/semesters`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addSemester = async (semester: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/semester`, semester, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateSemester = async (id: number, semester: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/semester/${id}`, semester, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteSemester = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/semester/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}