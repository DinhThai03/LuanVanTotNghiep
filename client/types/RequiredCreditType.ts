import { FacultyData } from "./FacultyType";
import { Cohort } from "./NameType";

export interface RequiredCredit {
    id: number;
    cohort_id: number;
    faculty_id: number;
    required_credit: number;
    faculty: FacultyData;
    cohort: Cohort;
}