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
            // Giáo viên 1
            [
                'username'         => 'giaovien01',
                'password'         => Hash::make('password123'),
                'role'             => 'teacher',
                'email'            => 'gv01@truonghoc.vn',
                'date_of_birth'    => '1980-03-12',
                'first_name'       => 'Minh',
                'last_name'        => 'Nguyễn Văn',
                'sex'              => 1,
                'address'          => '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
                'phone'            => '0909123456',
                'identity_number'  => '123456789012',
                'issued_date'      => '2000-05-20',
                'issued_place'     => 'Công an TP. Hồ Chí Minh',
                'ethnicity'        => 'Kinh',
                'religion'         => 'Không',
                'is_active'        => 1,
                'remember_token'   => null,
            ],
            // Giáo viên 2
            [
                'username'         => 'giaovien02',
                'password'         => Hash::make('password123'),
                'role'             => 'teacher',
                'email'            => 'gv02@truonghoc.vn',
                'date_of_birth'    => '1985-07-25',
                'first_name'       => 'Trang',
                'last_name'        => 'Phạm Thị',
                'sex'              => 0,
                'address'          => '45 Nguyễn Huệ, Quận Hải Châu, Đà Nẵng',
                'phone'            => '0911122334',
                'identity_number'  => '456789123456',
                'issued_date'      => '2003-08-15',
                'issued_place'     => 'Công an Đà Nẵng',
                'ethnicity'        => 'Kinh',
                'religion'         => 'Phật giáo',
                'is_active'        => 1,
                'remember_token'   => null,
            ],
            // Sinh viên 1
            [
                'username'         => 'sinhvien01',
                'password'         => Hash::make('password123'),
                'role'             => 'student',
                'email'            => 'sv01@sinhvien.vn',
                'date_of_birth'    => '2002-11-05',
                'first_name'       => 'Anh',
                'last_name'        => 'Lê Văn',
                'sex'              => 1,
                'address'          => '10 Nguyễn Trãi, Hà Đông, Hà Nội',
                'phone'            => '0987123456',
                'identity_number'  => '321654987000',
                'issued_date'      => '2020-01-01',
                'issued_place'     => 'Công an Hà Nội',
                'ethnicity'        => 'Kinh',
                'religion'         => 'Không',
                'is_active'        => 1,
                'remember_token'   => null,
            ],
            // Sinh viên 2
            [
                'username'         => 'sinhvien02',
                'password'         => Hash::make('password123'),
                'role'             => 'student',
                'email'            => 'sv02@sinhvien.vn',
                'date_of_birth'    => '2003-04-22',
                'first_name'       => 'Hương',
                'last_name'        => 'Trần Thị',
                'sex'              => 0,
                'address'          => '200 Trần Hưng Đạo, TP. Huế',
                'phone'            => '0934556677',
                'identity_number'  => '654321987000',
                'issued_date'      => '2021-05-10',
                'issued_place'     => 'Công an Thừa Thiên Huế',
                'ethnicity'        => 'Kinh',
                'religion'         => 'Thiên chúa giáo',
                'is_active'        => 1,
                'remember_token'   => null,
            ],
            // Phụ huynh 1
            [
                'username'         => 'phuhuynh01',
                'password'         => Hash::make('password123'),
                'role'             => 'parent',
                'email'            => 'ph01@phuhuynh.vn',
                'date_of_birth'    => '1970-09-17',
                'first_name'       => 'Hải',
                'last_name'        => 'Đỗ Văn',
                'sex'              => 1,
                'address'          => '88 Lý Thường Kiệt, TP. Nam Định',
                'phone'            => '0978123456',
                'identity_number'  => '123987456321',
                'issued_date'      => '1990-10-05',
                'issued_place'     => 'Công an Nam Định',
                'ethnicity'        => 'Kinh',
                'religion'         => 'Không',
                'is_active'        => 1,
                'remember_token'   => null,
            ],
            // Phụ huynh 2
            [
                'username'         => 'phuhuynh02',
                'password'         => Hash::make('password123'),
                'role'             => 'parent',
                'email'            => 'ph02@phuhuynh.vn',
                'date_of_birth'    => '1978-02-28',
                'first_name'       => 'Lan',
                'last_name'        => 'Nguyễn Thị',
                'sex'              => 0,
                'address'          => '15 Phạm Văn Đồng, TP. Cần Thơ',
                'phone'            => '0966112233',
                'identity_number'  => '789456123999',
                'issued_date'      => '1998-12-12',
                'issued_place'     => 'Công an Cần Thơ',
                'ethnicity'        => 'Kinh',
                'religion'         => 'Phật giáo',
                'is_active'        => 1,
                'remember_token'   => null,
            ],
        ]);
    }
}
