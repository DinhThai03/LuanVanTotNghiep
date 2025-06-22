import axios from "./Axios";
import Cookies from "js-cookie";

export const getStudents = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/students`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addStudent = async (student: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/student`, student, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateStudent = async (code: string, student: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/student/${code}`, student, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteStudent = async (code: string) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/student/${code}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}