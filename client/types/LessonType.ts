import { RoomData } from "./RoomType";
import { SemesterData } from "./SemesterType";
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
    semester_id: number;
    teacher_subject: TeacherSubjectData;
    room: RoomData;
    semester?: SemesterData;
}

export interface Lecture {
    id: number;
    start_date: string;
    end_date: string;
    day_of_week: number;
    room_id: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    registrations_count: number;
    teacher_subject_id: number;
    is_registered: boolean;
    semester_id: number;
    teacher_subject: TeacherSubjectData;
    room: RoomData;
}

export interface SubjectLectureData {
    [subjectCode: string]: Lecture[];
}