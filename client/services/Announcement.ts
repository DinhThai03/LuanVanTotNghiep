import axios from "@/lib/Axios";

export const getAnnouncements = async () => {
    const res = await axios.get("/api/announcements");
    return res.data;
};

interface GetAnnouncementsParams {
    target?: "all" | "students" | "teachers" | "custom";
    class_id?: number;
    teacher_id?: number;
    from?: string; // yyyy-mm-dd
    to?: string;   // yyyy-mm-dd
}

export const getFilterAnnouncements = async (params?: GetAnnouncementsParams) => {
    const res = await axios.get("/api/announcements/filter", { params });
    return res.data;
};

export const addAnnouncement = async (announcement: FormData) => {
    const res = await axios.post("/api/announcement", announcement, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res;
};

export const updateAnnouncement = async (id: number, announcement: FormData) => {
    const res = await axios.post(`/api/announcement/${id}`, announcement);
    return res;
};

export const deleteAnnouncement = async (id: number) => {
    const res = await axios.delete(`/api/announcement/${id}`);
    return res.data;
};
