export interface Subject {
    id: number;
    name: string;
    credit: number;
    tuition_credit: number;
    midterm_percent: number;
    process_percent: number;
    final_percent: number;
    subject_type: 'LT' | 'TH' | string;
    is_active: boolean;
}
