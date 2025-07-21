"use client";

import AnnouncementList from "@/components/AnnouncementList";
import { profile } from "@/features/auth/api";
import { getFilterAnnouncements } from "@/services/Announcement";
import { AnnouncementData } from "@/types/AnnouncementType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const [announcementData, setAnnouncementData] = useState<AnnouncementData[]>([]);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const user = await profile();
                const target = user?.role === "student" || user.role === "parent" ? "students" : "teachers";
                const res = await getFilterAnnouncements({ target });
                setAnnouncementData(res.data);
            } catch (err) {
                toast.error("Lỗi khi tải thông báo");
                console.error(err);
            }
        };
        fetchInfo();
    }, []);

    return (
        <div className="bg-white w-full h-[calc(100vh-60px)] p-4 overflow-y-auto">
            {announcementData.length > 0 ? (
                <AnnouncementList announcements={announcementData} />
            ) : (
                <div className="text-center text-gray-500">Không có thông báo nào</div>
            )}
        </div>
    );
};

export default Page;
