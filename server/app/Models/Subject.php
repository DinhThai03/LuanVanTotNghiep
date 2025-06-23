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
}
