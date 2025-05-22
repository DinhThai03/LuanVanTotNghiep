<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TuitionFeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tuition_fees')->insert([
            [
                'registration_id' => 1,
                'amount' => 1500000.00,
                'paid_at' => now(),
                'payment_method' => 'credit_card',
                'payment_status' => 'success',
                'transaction_id' => 'TXN123456789',
            ],
            [
                'registration_id' => 2,
                'amount' => 2000000.00,
                'paid_at' => now(),
                'payment_method' => 'bank_transfer',
                'payment_status' => 'pending',
                'transaction_id' => 'TXN987654321',
            ],
            // Thêm dữ liệu mẫu tùy ý
        ]);
    }
}
