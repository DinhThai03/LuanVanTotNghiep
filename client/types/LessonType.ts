import { RoomData } from "./RoomType";
import { TeacherSubjectData } from "./TeacherSubjectType";

export interface LessonData {
    id: number;
    start_date: string;
    end_date: string;
    day_of_week: number;
    room_id: number;
    start_time: string;
    end_time: string;
    is_active: string;
    teacher_subject_id: number;
    teacher_subject: TeacherSubjectData;
    room: RoomData;
}