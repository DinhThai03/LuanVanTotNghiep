<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'start_year',
        'end_year',
        'name',
    ];

    // Quan hệ 1-nhiều với bảng semesters
    public function semesters()
    {
        return $this->belongsTo(
            Semester::class,
            'academic_year_id',
        );
    }
}
