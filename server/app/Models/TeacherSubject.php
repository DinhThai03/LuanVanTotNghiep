<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherSubject extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'teacher_code',
        'subject_id',
    ];

    

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_code', 'code');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'teacher_subject_id');
    }
}
