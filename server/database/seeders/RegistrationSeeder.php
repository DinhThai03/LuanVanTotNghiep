<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('registrations')->insert([
            [
                'status' => 'pending',
                'student_code' => 'DH52100123',   // Mã sinh viên phải tồn tại trong bảng students
                'lesson_id' => 1,            // ID của lịch học phải tồn tại trong bảng lessons
            ],
            [
                'status' => 'approved',
                'student_code' => 'DH52100124',
                'lesson_id' => 2,
            ],
            [
                'status' => 'completed',
                'student_code' => 'DH52100125',
                'lesson_id' => 3,
            ],
        ]);
    }
}
