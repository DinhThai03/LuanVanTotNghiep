import axios from "./Axios";
import Cookies from "js-cookie";

export const getTeachers = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/teachers`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addTeacher = async (teacher: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/teacher`, teacher, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateTeacher = async (code: string, teacher: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/teacher/${code}`, teacher, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteTeacher = async (code: string) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teacher/${code}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}