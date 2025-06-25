import axios from "./Axios";
import Cookies from "js-cookie";

export const getSubjects = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/subjects`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}

export const getSubjectsByFaculty = async (faculty_id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/faculties/${faculty_id}/all-subjects`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addSubject = async (subject: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/subject`, subject, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateSubject = async (id: number, subject: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/subject/${id}`, subject, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteSubject = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subject/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}