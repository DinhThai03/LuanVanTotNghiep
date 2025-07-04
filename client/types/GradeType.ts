import { RegistrationData } from "./RegistrationType";

export interface GradeData {
    registration_id: number;
    process_score: number;
    midterm_score: number;
    final_score: number;
    average_score: number;
    letter_grade: string;
    result: number;
    registration: RegistrationData;
}

export interface GradeItem {
    stt: number;
    subject_code: string;
    subject_name: string;
    credit: number;
    process_percent: number;
    midterm_percent: number;
    process_score: number | null;
    midterm_score: number | null;
    final_score: number | null;
    average_score: number | null;
    letter_grade: string | null;
    result: 0 | 1 | null;
}

export interface SemesterGrade {
    semester_name: string;
    academic_year_name: string;
    grades: GradeItem[];
}
