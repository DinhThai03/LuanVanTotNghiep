import axios from "./Axios";
import Cookies from "js-cookie";

export const getAcademicYears = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/academic_years`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addAcademicYear = async (academic_year: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/academic_year`, academic_year, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateAcademicYear = async (code: number, academic_year: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/academic_year/${code}`, academic_year, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteAcademicYear = async (code: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/academic_year/${code}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}