<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RegistrationPeriod;
use App\Models\Faculty;
use App\Models\Semester;
use Carbon\Carbon;

class RegistrationPeriodSeeder extends Seeder
{
    public function run(): void
    {
        $faculties = Faculty::inRandomOrder()->limit(5)->get();      // chọn ngẫu nhiên 5 khoa
        $semesters = Semester::inRandomOrder()->limit(3)->get();     // chọn ngẫu nhiên 3 học kỳ

        foreach ($faculties as $faculty) {
            foreach ($semesters as $semester) {
                // Tránh tạo trùng
                if (
                    RegistrationPeriod::where('faculty_id', $faculty->id)
                    ->where('semester_id', $semester->id)
                    ->exists()
                ) {
                    continue;
                }

                // Ngày random từ hôm nay
                $round1Start = Carbon::now()->addDays(rand(1, 10))->startOfDay()->addHours(8);
                $round1End = (clone $round1Start)->addDays(3)->setHour(17);

                $round2Start = (clone $round1End)->addDays(rand(2, 4))->setHour(8);
                $round2End = (clone $round2Start)->addDays(2)->setHour(17);

                RegistrationPeriod::create([
                    'faculty_id' => $faculty->id,
                    'semester_id' => $semester->id,
                    'round1_start' => $round1Start,
                    'round1_end' => $round1End,
                    'round2_start' => $round2Start,
                    'round2_end' => $round2End,
                ]);
            }
        }
    }
}
