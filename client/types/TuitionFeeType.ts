import { FacultyData } from "./FacultyType";
import { SemesterData } from "./SemesterType";
import { StudentData } from "./StudentType";

export interface TuitionFee {
    id: number;
    registration_id: number;
    amount: string;
    paid_at: string | null;
    payment_method: string | null;
    payment_status: string;
    transaction_id: string | null;
    registration: {
        id: number;
        status: string;
        student_code: string;
        lesson_id: number;
        lesson: {
            id: number;
            start_date: string;
            end_date: string;
            day_of_week: number;
            room_id: number;
            start_time: string;
            end_time: string;
            is_active: boolean;
            teacher_subject_id: number;
            semester_id: number;
            teacher_subject: {
                id: number;
                teacher_code: string;
                subject_id: number;
                subject: {
                    id: number;
                    code: string;
                    name: string;
                    credit: number;
                    tuition_credit: number;
                };
            };
        };
    };
};

export interface StudentInfo {
    code: string;
    full_name: string;
    email: string;
    phone: string;
}

export interface PaymentDetail {
    id: number;
    amount: string; // có thể để kiểu `string` nếu backend trả về string, hoặc `number` nếu muốn chuẩn hóa
    paid_at: string; // ISO datetime string
    payment_method: string;
    transaction_id: string;
}

export interface StudentTuitionData {
    stt: number;
    student: StudentInfo;
    faculties: FacultyData[];
    class: string | null;
    paid_amount: number;
    total_amount: number;
    remaining_amount: number;
    payment_details: PaymentDetail[];
}

export interface TuitionSummaryData {
    semester: SemesterData;
    students: StudentTuitionData[];
}