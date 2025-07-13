"use client"

import AnnouncementList from "@/components/AnnouncementList";
import { profile } from "@/features/auth/api";
import { getFilterAnnouncements } from "@/services/Announcement";
import { AnnouncementData } from "@/types/AnnouncementType";
import { useEffect, useState } from "react"
import { toast } from "sonner";

const Page = () => {
    const [announcementData, setAnnouncementData] = useState<AnnouncementData[]>([]);
    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await profile();
                if (res?.role === "student" || res.role == "parent") {
                    const res = await getFilterAnnouncements({ target: "students" });
                    setAnnouncementData(res.data);
                } else {
                    const res = await getFilterAnnouncements({ target: "teachers" });
                    setAnnouncementData(res.data);
                }
            } catch (err) {
                // toast.error("Lỗi khi tải thông tin sinh viên");
                console.error(err);
            }
        };
        fetchInfo();
    }, [])
    return (
        <div className='bg-white w-full h-[calc(100vh-60px)] p-4'>
            <AnnouncementList announcements={announcementData} />
        </div>
    )
}

export default Page