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
            'username'        => 'admin1',
            'password'        => Hash::make('password123'),
            'role'            => 'admin',
            'email'           => 'admin@example.com',
            'date_of_birth'   => '1990-01-01',
            'first_name'      => 'System',
            'last_name'       => 'Administrator',
            'sex'             => 1,
            'address'         => '123 Admin Street',
            'phone'           => '0123456789',
            'is_active'       => 1,
        ]);

        // Gán user_id vào bảng admins
        Admin::create([
            'user_id'     => $user->id,
            'admin_level' => 1,
        ]);
    }
}
