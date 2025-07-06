<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('parents')->insert([
            [
                'user_id' => 5,           // user_id của phụ huynh (phải tồn tại trong bảng users)
                'student_code' => 'DH52100123' // mã học sinh (phải tồn tại trong bảng students)
            ],
            [
                'user_id' => 6,
                'student_code' => 'DH52100124'
            ],
        ]);
    }
}
