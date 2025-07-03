<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CreditPrice;

class CreditPriceSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'subject_type' => 'LT', // Lý thuyết
                'price_per_credit' => 250000,
                'is_active' => true,
                'academic_year_id' => 1,
            ],
            [
                'subject_type' => 'TH', // Thực hành
                'price_per_credit' => 300000,
                'is_active' => true,
                'academic_year_id' => 2,
            ],
        ];

        foreach ($data as $item) {
            CreditPrice::create($item);
        }

        $this->command->info('✅ CreditPriceSeeder đã tạo dữ liệu giá tín chỉ thành công.');
    }
}
