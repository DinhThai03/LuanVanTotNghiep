import { FacultyData } from "./FacultyType";
import { TeacherSubjectData } from "./TeacherSubjectType";

export interface FacultySubjectData {
    id: number;
    subject_id: number;
    faculty_id: number;
    faculty: FacultyData;
}

export interface SubjectData {
    id: number;
    code: string;
    name: string;
    credit: number;
    tuition_credit: number;
    midterm_percent: number;
    process_percent: number;
    final_percent: number;
    year: number;
    subject_type: 'LT' | 'TH' | 'DA' | 'KL';
    is_active: number;
    file_path: string;
    faculty_subjects: FacultySubjectData[];
    teacher_subjects?: TeacherSubjectData;

}