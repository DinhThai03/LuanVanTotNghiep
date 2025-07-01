<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'start_year',
        'end_year',
    ];

    // Quan hệ 1-nhiều với bảng semesters
    public function semesters()
    {
        return $this->hasMany(
            Semester::class,
            'academic_year_id'
        );
    }
}
