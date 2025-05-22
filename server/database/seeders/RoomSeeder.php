<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rooms')->insert([
            ['name' => 'Room A101', 'size' => 40],
            ['name' => 'Room B202', 'size' => 35],
            ['name' => 'Room C303', 'size' => 50],
        ]);
    }
}
