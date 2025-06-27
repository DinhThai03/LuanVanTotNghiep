<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RegistrationPeriod extends Model
{
    use HasFactory;

    protected $table = 'registration_periods';

    protected $fillable = [
        'faculty_id',
        'semester_id',
        'round1_start',
        'round1_end',
        'round2_start',
        'round2_end',
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
}
