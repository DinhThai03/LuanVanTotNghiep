import axios from "./Axios";
import Cookies from "js-cookie";

export const getSemesterSubjects = async (faculty_id?: number, semester_id?: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/semester_subjects`,
        {
            params: {
                faculty_id: faculty_id,
                semester_id: semester_id,
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const getSubjectsFromSemester = async (semester_id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/semester/${semester_id}/subjects`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}



export const addSemesterSubject = async (semester_subject: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/semester_subject`, semester_subject, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const storeOrUpdateSemesterSubjects = async (semester_subject: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/semester-subjects/update`, semester_subject, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const updateSemesterSubject = async (id: number, semester_subject: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/semester_subject/${id}`, semester_subject, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteSemesterSubject = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/semester_subject/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}