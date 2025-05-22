<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    // protected $table = 'classes'; // Khai báo tên bảng vì model không trùng tên bảng

    protected $fillable = [
        'name',
        'student_count',
        'faculty_id',
    ];

    

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function announcements()
    {
        return $this->belongsToMany(Announcement::class, 'class_announcements', 'class_id', 'announcement_id');
    }

    public function examClassRooms()
    {
        return $this->hasMany(ExamClassRoom::class, 'class_id');
    }
}
