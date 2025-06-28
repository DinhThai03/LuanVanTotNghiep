<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
                'start_time' => '08:00',
                'end_time' => '10:00',
                'room_id' => 1,
                'is_active' => true,
                'teacher_subject_id' => 1,
                'semester_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-15',
                'day_of_week' => 4, // Thứ 4
                'start_time' => '10:15',
                'end_time' => '12:00',
                'room_id' => 2,
                'is_active' => true,
                'teacher_subject_id' => 2,
                'semester_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-15',
                'day_of_week' => 6, // Thứ 6
                'start_time' => '13:00',
                'end_time' => '15:00',
                'room_id' => 1,
                'is_active' => true,
                'teacher_subject_id' => 1,
                'semester_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
