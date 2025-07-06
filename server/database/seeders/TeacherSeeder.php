<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Giả sử các user_id này đã tồn tại trong bảng users với role = 'teacher'
        DB::table('teachers')->insert([
            [
                'code' => 'GV00000001',
                'user_id' => 1,
                'faculty_id' => 1,
            ],
            [
                'code' => 'GV00000002',
                'user_id' => 3,
                'faculty_id' => 2,
            ],

        ]);
    }
}
