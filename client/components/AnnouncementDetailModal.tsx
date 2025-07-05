"use client";

import { AnnouncementData } from "@/types/AnnouncementType";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { FileText } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    data: AnnouncementData | null;
}

export default function AnnouncementDetailModal({ open, onClose, data }: Props) {
    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{data.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Ngày thông báo: {format(new Date(data.date), "dd/MM/yyyy", { locale: vi })}
                    </p>
                    <div className="text-base whitespace-pre-line">{data.content}</div>

                    {data.file_path && (
                        <Link
                            href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${data.file_path}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                        >
                            <FileText className="w-4 h-4" /> Xem tệp đính kèm
                        </Link>
                    )}

                    {data.classes?.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            Áp dụng cho: {data.classes.map((c) => c.name).join(", ")}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
