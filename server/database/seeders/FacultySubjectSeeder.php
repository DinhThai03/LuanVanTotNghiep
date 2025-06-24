<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultySubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('faculty_subjects')->insert([
            [
                'subject_id' => 1,   // Giả sử môn học id 1 tồn tại
                'faculty_id' => 1,   // Giả sử khoa id 1 tồn tại
            ],
            [
                'subject_id' => 2,
                'faculty_id' => 1,
            ],
            [
                'subject_id' => 3,
                'faculty_id' => 2,
            ],
            [
                'subject_id' => 4,
                'faculty_id' => 3,
            ],
        ]);
    }
}
