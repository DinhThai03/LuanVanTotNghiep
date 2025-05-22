<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LessonRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lesson_rooms')->insert([
            [
                'lesson_id' => 1,   // phải tồn tại trong bảng lessons
                'room_id' => 1,     // phải tồn tại trong bảng rooms
                'start_time' => '08:00:00',
                'end_time' => '10:00:00',
            ],
            [
                'lesson_id' => 2,
                'room_id' => 2,
                'start_time' => '10:00:00',
                'end_time' => '12:00:00',
            ],
            [
                'lesson_id' => 3,
                'room_id' => 3,
                'start_time' => '13:00:00',
                'end_time' => '15:00:00',
            ],
        ]);
    }
}
