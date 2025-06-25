<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'credit',
        'tuition_credit',
        'midterm_percent',
        'process_percent',
        'final_percent',
        'year',
        'subject_type',
        'is_active',
    ];



    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class, 'subject_id');
    }

    public function semesterSubjects()
    {
        return $this->hasMany(SemesterSubject::class, 'subject_id');
    }

    public function facultySubjects()
    {
        return $this->hasMany(FacultySubject::class, 'subject_id');
    }

    public function faculties()
    {
        return $this->belongsToMany(Faculty::class, 'faculty_subjects', 'subject_id', 'faculty_id');
    }
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_subjects', 'subject_id', 'teacher_code');
    }
}
