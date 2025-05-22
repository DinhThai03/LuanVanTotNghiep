<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            
            [
                'username' => 'teacher01',
                'password' => Hash::make('password123'), 
                'role' => 'teacher',
                'email' => 'teacher01@example.com',
                'date_of_birth' => '1985-05-15',
                'full_name' => 'Teacher One',
                'address' => '456 Teacher Ave',
                'phone' => '0987654321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'student01',
                'password' => Hash::make('password123'), 
                'role' => 'student',
                'email' => 'student01@example.com',
                'date_of_birth' => '2000-09-10',
                'full_name' => 'Student One',
                'address' => '789 Student Rd',
                'phone' => '0912345678',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'parent01',
                'password' => Hash::make('password123'), 
                'role' => 'parent',
                'email' => 'parent01@example.com',
                'date_of_birth' => '1975-07-20',
                'full_name' => 'Parent One',
                'address' => '321 Parent Blvd',
                'phone' => '0998877665',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
