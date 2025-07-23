<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequiredCredit extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'faculty_id',
        'cohort_id',
        'required_credit',
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function cohort()
    {
        return $this->belongsTo(Cohort::class);
    }
}
