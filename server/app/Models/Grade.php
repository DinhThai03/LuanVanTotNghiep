<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'registration_id',
        'process_score',
        'midterm_score',
        'final_score',
    ];

    

    public function registration()
    {
        return $this->belongsTo(Registration::class, 'registration_id');
    }
}
