<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'academic_year_id'
    ];

    public function academicYear()
    {
        return $this->belongsTo(
            AcademicYear::class,
            'academic_year_id'
        );
    }

    public function semesterSubjects()
    {
        return $this->hasMany(SemesterSubject::class, 'semester_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'semester_subjects',  'semester_id', 'subject_id',);
    }

    public function examSchedules()
    {
        return $this->hasManyThrough(
            ExamSchedule::class,
            SemesterSubject::class,
            'semester_id', // Foreign key on SemesterSubject table...
            'semester_subject_id', // Foreign key on ExamSchedule table...
            'id', // Local key on Semester table...
            'id' // Local key on SemesterSubject table...
        );
    }

    public function registrationPeriods()
    {
        return $this->hasMany(RegistrationPeriod::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}
