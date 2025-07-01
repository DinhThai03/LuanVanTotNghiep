import { FacultyData } from "./FacultyType";
import { SemesterData } from "./SemesterType";

export interface RegistrationPeriodData {
    id: number;
    faculty_id: number;
    semester_id: number;
    round1_start: string;
    round1_end: string;
    round2_start: string;
    round2_end: string;
    faculty: FacultyData;
    semester: SemesterData;
}