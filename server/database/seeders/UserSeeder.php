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
                'first_name' => 'Teacher',
                'last_name' => 'One',
                'sex' => 1,
                'address' => '456 Teacher Ave',
                'phone' => '0987654321',
                'is_active' => 1,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'student01',
                'password' => Hash::make('password123'),
                'role' => 'student',
                'email' => 'student01@example.com',
                'date_of_birth' => '2000-09-10',
                'first_name' => 'Student',
                'last_name' => 'One',
                'sex' => 0,
                'address' => '789 Student Rd',
                'phone' => '0912345678',
                'is_active' => 1,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'parent01',
                'password' => Hash::make('password123'),
                'role' => 'parent',
                'email' => 'parent01@example.com',
                'date_of_birth' => '1975-07-20',
                'first_name' => 'Parent',
                'last_name' => 'One',
                'sex' => 1,
                'address' => '321 Parent Blvd',
                'phone' => '0998877665',
                'is_active' => 1,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
