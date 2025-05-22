<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('grades')->insert([
            [
                'registration_id' => 1, // phải tồn tại trong bảng registrations
                'process_score' => 7.5,
                'midterm_score' => 8.0,
                'final_score' => 9.0,
            ],
            [
                'registration_id' => 2,
                'process_score' => 6.0,
                'midterm_score' => 7.0,
                'final_score' => 7.5,
            ],
            [
                'registration_id' => 3,
                'process_score' => 8.0,
                'midterm_score' => 8.5,
                'final_score' => 8.5,
            ],
        ]);
    }
}
