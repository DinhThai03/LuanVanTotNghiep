export interface GraduationStudentResult {
    student_code: string;
    student_name: string;
    can_graduate: boolean;
    graduation_rank: "Xuất sắc" | "Giỏi" | "Khá" | "Trung bình" | null;
    yearly_gpa: YearlyGPA[];
}

export interface YearlyGPA {
    academic_year: string;
    total_credits: number;
    gpa: number;
}
