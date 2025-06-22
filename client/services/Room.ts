import axios from "./Axios";
import Cookies from "js-cookie";

export const getRooms = async () => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.get(`/api/rooms`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}


export const addRoom = async (room: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/room`, room, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}

export const updateRoom = async (id: number, room: FormData) => {
    const accessToken = String(Cookies.get('access_token'));

    const res = await axios.post(`/api/room/${id}`, room, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return res;
}


export const deleteRoom = async (id: number) => {
    const accessToken = String(Cookies.get('access_token'));
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/room/${id}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    )
    return res.data;
}