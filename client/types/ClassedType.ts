import { FacultyData } from '@/types/FacultyType';
import { CohortData } from './CohortType';
export interface ClassedData {
    id: number;
    name: string;
    student_count: number;
    faculty_id: number;
    cohort_id: number;
    faculty: FacultyData;
    cohort: CohortData;
}