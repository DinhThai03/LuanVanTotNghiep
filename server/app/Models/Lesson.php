<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'start_date',
        'end_date',
        'day_of_week',
        'is_active',
        'teacher_subject_id',
    ];

    

    public function teacherSubject()
    {
        return $this->belongsTo(TeacherSubject::class, 'teacher_subject_id');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class, 'lesson_id');
    }

    public function lessonRooms()
    {
        return $this->hasMany(LessonRoom::class, 'lesson_id');
    }
}
