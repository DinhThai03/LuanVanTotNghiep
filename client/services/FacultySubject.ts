import axios from "./Axios";
import Cookies from "js-cookie";

export const getFacultySubjects = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/faculty_subjects`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addFacultySubject = async (faculty_subject: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/faculty_subject`, faculty_subject, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateFacultySubject = async (id: number, faculty_subject: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/faculty_subject/${id}`, faculty_subject, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteFacultySubject = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/faculty_subject/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}