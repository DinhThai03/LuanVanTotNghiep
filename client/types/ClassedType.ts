import { FacultyData } from '@/types/FacultyType';
export interface ClassedData {
    id: number;
    name: string;
    student_count: number;
    faculty_id: number;
    faculty: FacultyData;
}