import { ClassData } from "./ClassType";
export interface AnnouncementData {
    id: number;
    title: string;
    content: string;
    date: string; // ISO format: "YYYY-MM-DD"
    file_path?: string;
    target_type: "all" | "students" | "teachers" | "custom";
    classes: ClassData[]; // các lớp áp dụng nếu target_type === "custom"
}
