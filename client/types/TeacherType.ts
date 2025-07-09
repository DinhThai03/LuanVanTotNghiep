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

export interface TeacherInfo {
    code: string;
    status: string;
    semester: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
    };
    faculty: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        username: string;
        full_name: string;
        email: string;
        phone: string;
        address: string;
        is_active: boolean;
    };
    total_subjects: number;
    total_lessons: number;
}
