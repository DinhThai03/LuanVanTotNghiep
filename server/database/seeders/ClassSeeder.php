<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolClass;
use App\Models\Faculty;
use App\Models\Cohort;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $faculties = Faculty::all();
        $cohorts = Cohort::all();

        if ($faculties->isEmpty()) {
            $this->command->warn('⚠️ Không có dữ liệu trong bảng faculties. Hãy seed FacultySeeder trước.');
            return;
        }

        if ($cohorts->isEmpty()) {
            $this->command->warn('⚠️ Không có dữ liệu trong bảng cohorts. Hãy seed CohortSeeder trước.');
            return;
        }

        foreach ($faculties as $faculty) {
            // Chọn 1 cohort ngẫu nhiên
            $cohort = $cohorts->random();

            SchoolClass::create([
                'name' => 'Lớp ' . strtoupper(substr($faculty->name, 0, 3)) . rand(100, 999),
                'student_count' => rand(30, 50),
                'faculty_id' => $faculty->id,
                'cohort_id' => $cohort->id, // ← thêm dòng này
            ]);
        }

        $this->command->info('✅ ClassSeeder đã tạo dữ liệu lớp học thành công.');
    }
}
