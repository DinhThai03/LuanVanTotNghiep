import { AcademicYearData } from "./AcademicYearType";

export interface SemesterData {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    academic_year_id: number;
    academic_year: AcademicYearData;
}