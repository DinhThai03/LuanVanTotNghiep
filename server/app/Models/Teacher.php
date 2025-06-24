<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $primaryKey = 'code';  // Khóa chính là code kiểu CHAR(10)
    public $incrementing = false;    // Không tự tăng
    protected $keyType = 'string';   // Kiểu khóa chính là string

    protected $fillable = [
        'code',
        'status',
        'user_id',
        'faculty_id',
    ];



    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class, 'teacher_code', 'code');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
}
