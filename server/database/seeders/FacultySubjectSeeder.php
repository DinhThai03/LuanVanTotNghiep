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
                'year' => 2024,
                'subject_id' => 1,   // Giả sử môn học id 1 tồn tại
                'faculty_id' => 1,   // Giả sử khoa id 1 tồn tại
            ],
            [
                'year' => 2024,
                'subject_id' => 2,
                'faculty_id' => 1,
            ],
            [
                'year' => 2024,
                'subject_id' => 3,
                'faculty_id' => 2,
            ],
            [
                'year' => 2024,
                'subject_id' => 4,
                'faculty_id' => 3,
            ],
        ]);
    }
}
