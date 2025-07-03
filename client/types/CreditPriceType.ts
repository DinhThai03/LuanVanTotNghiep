import { AcademicYearData } from "./AcademicYearType";

export interface CreditPriceData {
    id: number;
    subject_type: 'LT' | 'TH';
    price_per_credit: number;
    is_active: boolean;
    academic_year_id: number;
    academic_year: AcademicYearData;
}