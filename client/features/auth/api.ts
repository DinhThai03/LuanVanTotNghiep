import axios from "axios"
import Cookies from "js-cookie";

export const login = async (username: string, password: string) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { username, password },
        {
            headers: {
                'Accept': 'application/json',
            },
        }
    );
    return res;
}

export const profile = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,  
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}
