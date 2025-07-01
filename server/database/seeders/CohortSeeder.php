<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cohort;

class CohortSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cohorts = [
            [
                'name' => 'Khóa 2020',
                'start_year' => 2020,
                'end_year' => 2024,
            ],
            [
                'name' => 'Khóa 2021',
                'start_year' => 2021,
                'end_year' => 2025,
            ],
            [
                'name' => 'Khóa 2022',
                'start_year' => 2022,
                'end_year' => 2026,
            ],
        ];

        foreach ($cohorts as $cohort) {
            Cohort::create($cohort);
        }
    }
}
