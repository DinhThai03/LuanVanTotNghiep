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