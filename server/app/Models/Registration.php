<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'status',
        'student_code',
        'lesson_id',
    ];

    

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_code', 'code');
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

    public function grade()
    {
        return $this->hasOne(Grade::class, 'registration_id');
    }

    public function tuitionFee()
    {
        return $this->hasOne(TuitionFee::class, 'registration_id');
    }
}
