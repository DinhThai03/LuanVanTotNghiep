import { ClassData } from "./ClassType";
import { User } from "./UserType";

export interface StudentData {
    code: string;
    class_id: number;
    user_id: number;
    place_of_birth: string;
    status: string;
    user: User;
    school_class: ClassData;
}

export interface StudentSummary {
    student_code: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    class: string | null;
    status: 'studying' | 'paused' | 'graduated' | string;
    status_label: string;
    semester: string;
    semester_id: number;
    registration_count: number;
    total_credits: number;
    finished_subjects_count: number;
}
