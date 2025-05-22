<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SemesterSubject extends Model
{
    protected $fillable = [
        'subject_id',
        'semester_id',
    ];

    

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function examSchedules()
    {
        return $this->hasMany(ExamSchedule::class, 'semester_subject_id');
    }

    public function lessons()
    {
        return $this->hasManyThrough(
            Lesson::class,
            TeacherSubject::class,
            'subject_id',      // Foreign key on TeacherSubject table
            'teacher_subject_id', // Foreign key on Lesson table
            'subject_id',      // Local key on SemesterSubject (subject_id)
            'id'               // Local key on TeacherSubject
        );
    }
}
