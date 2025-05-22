<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeacherSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('teacher_subjects')->insert([
            [
                'teacher_code' => 'GV00000001',
                'subject_id' => 1,
            ],
            [
                'teacher_code' => 'GV00000001',
                'subject_id' => 2,
            ],
        ]);
    }
}
