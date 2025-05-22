<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolClass;
use App\Models\Faculty;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $faculties = Faculty::all();

        if ($faculties->isEmpty()) {
            $this->command->warn('⚠️ Không có dữ liệu trong bảng faculties. Hãy seed FacultySeeder trước.');
            return;
        }

        foreach ($faculties as $faculty) {
            SchoolClass::create([
                'name' => 'Lớp ' . strtoupper(substr($faculty->name, 0, 3)) . rand(100, 999),
                'student_count' => rand(30, 50),
                'faculty_id' => $faculty->id,
            ]);
        }

        $this->command->info('✅ ClassSeeder đã tạo dữ liệu lớp học thành công.');
    }
}
