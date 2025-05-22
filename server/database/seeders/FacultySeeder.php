<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('faculties')->insert([
            ['name' => 'Khoa Công nghệ thông tin'],
            ['name' => 'Khoa Điện tử - Viễn thông'],
            ['name' => 'Khoa Cơ khí'],
            ['name' => 'Khoa Quản trị kinh doanh'],
            ['name' => 'Khoa Ngoại ngữ'],
        ]);
    }
}
