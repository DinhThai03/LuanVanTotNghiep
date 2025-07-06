<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('students')->insert([
            [
                'code' => 'DH52100123',
                'class_id' => 1,
                'user_id' => 3,
                'place_of_birth' => 'Hanoi',

            ],
            [
                'code' => 'DH52100124',
                'class_id' => 1,
                'user_id' => 4,
                'place_of_birth' => 'Da Nang',

            ],
        ]);
    }
}
