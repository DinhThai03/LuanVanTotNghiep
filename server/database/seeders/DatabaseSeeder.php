<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed bảng users trước vì nhiều bảng FK đến bảng này
        $this->call([
            UserSeeder::class,
        ]);

        // 2. Seed bảng faculties
        $this->call([
            FacultySeeder::class,
        ]);

        // 3. Seed bảng academic_years
        $this->call([
            AcademicYearSeeder::class,
        ]);

        // 4. Seed bảng semesters
        $this->call([
            SemesterSeeder::class,
        ]);
        // 6. Seed bảng subjects
        $this->call([
            SubjectSeeder::class,
        ]);

        // 7. Seed bảng faculty_subjects (liên kết khoa và môn học)
        $this->call([
            FacultySubjectSeeder::class,
        ]);

        // 8. Seed bảng teachers (cần user_id)
        $this->call([
            TeacherSeeder::class,
        ]);

        // 9. Seed bảng teacher_subjects (liên kết giáo viên - môn học)
        $this->call([
            TeacherSubjectSeeder::class,
        ]);

        // 10. Seed bảng admins (cần user_id)
        $this->call([
            AdminSeeder::class,
        ]);

        // 11. Seed bảng classes (lớp học)
        $this->call([
            ClassSeeder::class,
        ]);

        // 12. Seed bảng rooms (phòng học)
        $this->call([
            RoomSeeder::class,
        ]);

        // 13. Seed bảng students (cần class_id và user_id)
        $this->call([
            StudentSeeder::class,
        ]);

        // 14. Seed bảng parents (phụ huynh, cần user_id và student_code)
        $this->call([
            ParentSeeder::class,
        ]);

        // 15. Seed bảng lessons (cần teacher_subject_id)
        $this->call([
            LessonSeeder::class,
        ]);

        // 16. Seed bảng lesson_rooms (phòng cho lịch học)
        
        // 17. Seed bảng semester_subjects (liên kết môn học - học kỳ)
        $this->call([
            SemesterSubjectSeeder::class,
        ]);

        // 18. Seed bảng registrations (đăng ký môn học, cần student_code, lesson_id)
        $this->call([
            RegistrationSeeder::class,
        ]);

        // 19. Seed bảng grades (cần registration_id)
        $this->call([
            GradeSeeder::class,
        ]);

        // 20. Seed bảng credit_prices
        $this->call([
            CreditPriceSeeder::class,
        ]);

        // 21. Seed bảng tuition_fees (cần registration_id)
        $this->call([
            TuitionFeeSeeder::class,
        ]);

        // 22. Seed bảng announcements (thông báo)
        $this->call([
            AnnouncementSeeder::class,
        ]);

        // 23. Seed bảng class_announcements (liên kết lớp - thông báo)
        $this->call([
            ClassAnnouncementSeeder::class,
        ]);

        // 24. Seed bảng exam_schedules
        $this->call([
            ExamScheduleSeeder::class,
        ]);

        // 25. Seed bảng exam_class_rooms (phòng thi cho lớp)
        $this->call([
            ExamClassRoomSeeder::class,
        ]);

        $this->call([
            RegistrationPeriodSeeder::class,
        ]);
    }
}
