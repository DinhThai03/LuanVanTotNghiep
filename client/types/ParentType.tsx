import { StudentData } from "./StudentType";
import { User } from "./UserType";

export interface ParentData {
    user_id: number;
    student_code: string;
    user: User;
    student: StudentData;
}