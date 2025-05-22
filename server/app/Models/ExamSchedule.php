<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamSchedule extends Model
{
    protected $fillable = [
        'exam_date',
        'exam_time',
        'duration',
        'is_active',
        'semester_subject_id',
        'academic_year_semester_id',
    ];

    

    public function semesterSubject()
    {
        return $this->belongsTo(SemesterSubject::class, 'semester_subject_id');
    }

    public function examClassRooms()
    {
        return $this->hasMany(ExamClassRoom::class, 'exam_schedule_id');
    }
}
