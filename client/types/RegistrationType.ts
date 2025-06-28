import { LessonData } from "./LessonType";
import { StudentData } from "./StudentType";

export interface RegistrationData {
    id: number;
    status: 'pending' | 'approved' | 'completed';
    student_code: string;
    lesson_id: number;
    student: StudentData;
    lesson: LessonData;
}