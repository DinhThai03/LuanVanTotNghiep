<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamClassRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ví dụ seed dữ liệu mẫu cho exam_class_rooms
        DB::table('exam_class_rooms')->insert([
            [
                'exam_schedule_id' => 1,
                'room_id' => 1,
                'class_id' => 1,
                'start_seat' => 1,
                'end_seat' => 30,
            ],
            [
                'exam_schedule_id' => 1,
                'room_id' => 2,
                'class_id' => 2,
                'start_seat' => 1,
                'end_seat' => 25,
            ],
            [
                'exam_schedule_id' => 2,
                'room_id' => 1,
                'class_id' => 3,
                'start_seat' => 1,
                'end_seat' => 30,
            ],
        ]);
    }
}
