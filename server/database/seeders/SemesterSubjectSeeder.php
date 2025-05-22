<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemesterSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('semester_subjects')->insert([
            [
                'subject_id' => 1,  // ID môn học 1
                'semester_id' => 1, // ID học kỳ 1
            ],
            [
                'subject_id' => 2,
                'semester_id' => 1,
            ],
            [
                'subject_id' => 3,
                'semester_id' => 2, // ID học kỳ 2
            ],
            [
                'subject_id' => 4,
                'semester_id' => 2,
            ],
            [
                'subject_id' => 5,
                'semester_id' => 3, // Học kỳ hè
            ],
        ]);
    }
}
