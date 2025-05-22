<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LessonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lessons')->insert([
            [
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-15',
                'day_of_week' => 2, // Thứ 2
                'is_active' => 1,
                'teacher_subject_id' => 1, // phải tồn tại trong bảng teacher_subjects
            ],
            [
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-15',
                'day_of_week' => 4, // Thứ 4
                'is_active' => 1,
                'teacher_subject_id' => 2,
            ],
            [
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-15',
                'day_of_week' => 6, // Thứ 6
                'is_active' => 1,
                'teacher_subject_id' => 1,
            ],
        ]);
    }
}
