import { TeacherSubjectData } from "./TeacherSubjectType";
import { User } from "./UserType";

export interface TeacherData {
    code: string;
    status: string;
    user_id: number;
    faculty_id: number;
    user: User;
    teacher_subjects: TeacherSubjectData[];
}