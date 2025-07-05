"use client";

import { AnnouncementData } from "@/types/AnnouncementType";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnnouncementDetailModal from "./AnnouncementDetailModal"; // Đảm bảo import đúng
import { useState } from "react";
import Link from "next/link";
import { Calendar, FileText } from "lucide-react";

interface AnnouncementListProps {
    announcements: AnnouncementData[];
}

export default function AnnouncementList({ announcements }: AnnouncementListProps) {
    const [selected, setSelected] = useState<AnnouncementData | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {announcements.map((a) => (
                    <Card
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <CardHeader>
                            <CardTitle className="text-lg">{a.title}</CardTitle>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(a.date), "dd/MM/yyyy", { locale: vi })}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3 text-sm text-gray-700">{a.content}</p>

                            {a.file_path && (
                                <div className="mt-3">
                                    <Link
                                        href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${a.file_path}`}
                                        className="inline-flex items-center text-blue-600 hover:underline text-sm"
                                        target="_blank"
                                    >
                                        <FileText className="w-4 h-4 mr-1" />
                                        Tệp đính kèm
                                    </Link>
                                </div>
                            )}

                            {a.classes?.length > 0 && (
                                <div className="mt-3 text-xs text-muted-foreground">
                                    Áp dụng cho:{" "}
                                    {a.classes.map((cls) => cls.name).join(", ")}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AnnouncementDetailModal
                open={!!selected}
                onClose={() => setSelected(null)}
                data={selected}
            />
        </>
    );
}
