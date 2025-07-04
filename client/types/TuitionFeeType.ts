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