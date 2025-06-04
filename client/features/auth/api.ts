import axios from "axios"

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
    console.log(res);
    return res;
}

export const profile = async (accessToken: string) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {   
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    console.log(res)
    return res
}
