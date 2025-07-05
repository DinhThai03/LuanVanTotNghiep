import { ClassData } from "./ClassType";

export interface AnnouncementData {
    id: number;
    title: string;
    content: string;
    date: string; // ISO format: "YYYY-MM-DD"
    file_path: string;
    classes: ClassData[];
}