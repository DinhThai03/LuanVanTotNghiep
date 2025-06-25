import { SubjectData } from "./SubjectType";

export interface TeacherSubjectData {
    id: number;
    teacher_code: string;
    subject_id: number;
    created_at: string | null;
    updated_at: string | null;
    subject: SubjectData;
}