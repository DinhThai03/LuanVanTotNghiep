<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('subjects')->insert([
            [
                'code' => 'MH00000001',
                'name' => 'Toán Cao Cấp',
                'credit' => 3,
                'tuition_credit' => 3,
                'midterm_percent' => 30.00,
                'process_percent' => 30.00,
                'final_percent' => 40.00,
                'year' => 2,
                'subject_type' => 'LT',
            ],
            [
                'code' => 'MH00000002',
                'name' => 'Lập trình Cơ Bản',
                'credit' => 4,
                'tuition_credit' => 4,
                'midterm_percent' => 25.00,
                'process_percent' => 25.00,
                'final_percent' => 50.00,
                'year' => 1,
                'subject_type' => 'TH',
            ],
            [
                'code' => 'MH00000003',
                'name' => 'Vật Lý Đại Cương',
                'credit' => 3,
                'tuition_credit' => 3,
                'midterm_percent' => 30.00,
                'process_percent' => 20.00,
                'final_percent' => 50.00,
                'year' => 1,
                'subject_type' => 'LT',
            ],
            [
                'code' => 'MH00000004',
                'name' => 'Cơ Sở Dữ Liệu',
                'credit' => 3,
                'tuition_credit' => 3,
                'midterm_percent' => 30.00,
                'process_percent' => 30.00,
                'final_percent' => 40.00,
                'year' => 1,
                'subject_type' => 'TH',
            ],
            [
                'code' => 'MH00000005',
                'name' => 'Mạng Máy Tính',
                'credit' => 3,
                'tuition_credit' => 3,
                'midterm_percent' => 30.00,
                'process_percent' => 30.00,
                'final_percent' => 40.00,
                'year' => 2,
                'subject_type' => 'LT',
            ],
        ]);
    }
}
