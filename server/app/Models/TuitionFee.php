<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TuitionFee extends Model
{
    protected $fillable = [
        'registration_id',
        'amount',
        'paid_at',
        'payment_method',
        'payment_status',
        'transaction_id',
    ];

    

    protected $dates = [
        'paid_at',
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class, 'registration_id');
    }
}
