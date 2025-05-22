<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo user với role admin
        $user = User::create([
            'username' => 'admin1',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email' => 'admin@example.com',
            'date_of_birth' => '1990-01-01',
            'full_name' => 'System Administrator',
            'address' => '123 Admin Street',
            'phone' => '0123456789',
        ]);

        // Gán user_id vào bảng admins
        Admin::create([
            'user_id' => $user->id,
            'admin_level' => 1,
        ]);
    }
}

