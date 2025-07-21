
import { SemesterSubjectData } from "./SemesterSubjectType";

export interface ExamSchedule {
    id: number;
    exam_date: string;
    exam_time: string;
    duration: number;
    is_active: boolean | number;
    semester_subject_id: number;
    semester_subject: SemesterSubjectData;
}

export interface ExamRoomData {
    id: number;
    exam_schedule_id: number;
    room_id: number;
    class_id: number;
    start_seat: number;
    end_seat: number;
    exam_schedule: ExamSchedule;
    class: string;
    room: string;
}


type ExamScheduleData = {
    subject_name: string;
    exam_date: string;
    exam_time: string;
    duration: number;
    rooms: ExamRoomData[];
};

export interface StudentExamSchedulesResponse {
    student_code: string;
    semester_id: number;
    exam_schedules: ExamScheduleData[];
};