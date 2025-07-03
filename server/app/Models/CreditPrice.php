<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditPrice extends Model
{
    protected $table = 'credit_prices';
    public $timestamps = false;
    protected $fillable = [
        'subject_type',
        'price_per_credit',
        'is_active',
        'academic_year_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price_per_credit' => 'decimal:2',
    ];

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }
}
