import { SubjectData } from "./SubjectType";
import { TeacherData } from "./TeacherType";

export interface ScheduleData {
    id: number;
    title: string;
    subject: SubjectData;
    teacher: TeacherData;
    allDay: boolean;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    room: string;
    repeat: "weekly" | "none" | string;
    dayOfWeek: number;
    file_path: string;
}