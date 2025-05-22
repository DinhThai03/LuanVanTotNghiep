<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('exam_schedules')->insert([
            [
                'exam_date' => '2025-06-10',
                'exam_time' => '09:00:00',
                'duration' => 120,
                'is_active' => 1,
                'semester_subject_id' => 1,
            ],
            [
                'exam_date' => '2025-06-11',
                'exam_time' => '14:00:00',
                'duration' => 90,
                'is_active' => 1,
                'semester_subject_id' => 2,
            ],
            [
                'exam_date' => '2025-12-05',
                'exam_time' => '09:00:00',
                'duration' => 180,
                'is_active' => 0,
                'semester_subject_id' => 3,
            ],
        ]);
    }
}
