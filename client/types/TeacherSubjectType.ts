import { SubjectData } from "./SubjectType";
import { TeacherData } from "./TeacherType";

export interface TeacherSubjectData {
    id: number;
    teacher_code: string;
    subject_id: number;
    teacher: TeacherData;
    subject: SubjectData;
}