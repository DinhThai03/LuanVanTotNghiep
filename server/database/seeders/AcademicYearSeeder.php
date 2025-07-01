<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AcademicYear;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AcademicYear::create([
            'start_year' => 2024,
            'end_year' => 2025,
        ]);

        AcademicYear::create([
            'start_year' => 2025,
            'end_year' => 2026,
        ]);
    }
}
