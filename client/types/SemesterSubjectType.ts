import { SemesterData } from "./SemesterType";
import { SubjectData } from "./SubjectType";

export interface SemesterSubjectData {
    id: number;
    subject_id: number;
    semester_id: number;
    subject: SubjectData;
    semester: SemesterData;
}