<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditPrice extends Model
{
    protected $fillable = [
        'subject_type',
        'price_per_credit',
        'is_active',
        'year',
    ];

    

    // Nếu muốn, bạn có thể thêm scope hoặc quan hệ tùy theo nghiệp vụ sau này
}
