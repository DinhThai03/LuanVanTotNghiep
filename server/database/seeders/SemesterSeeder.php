<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('semesters')->insert([
            [
                'name' => 'Học kỳ 1',
                'start_date' => '2024-09-01',
                'end_date' => '2024-12-31',
                'academic_year_id' => 1,
            ],
            [
                'name' => 'Học kỳ 2',
                'start_date' => '2025-01-10',
                'end_date' => '2025-05-15',
                'academic_year_id' => 1,
            ],
            [
                'name' => 'Học kỳ hè',
                'start_date' => '2025-06-01',
                'end_date' => '2025-08-15',
                'academic_year_id' => 1,
            ],
        ]);
    }
}
