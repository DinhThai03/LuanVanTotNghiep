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
                'user_id' => 1,
                'place_of_birth' => 'Hanoi',

            ],
            [
                'code' => 'DH52100124',
                'class_id' => 1,
                'user_id' => 2,
                'place_of_birth' => 'Da Nang',

            ],
            [
                'code' => 'DH52100125',
                'class_id' => 2,
                'user_id' => 3,
                'place_of_birth' => 'Ho Chi Minh City',

            ],

        ]);
    }
}
