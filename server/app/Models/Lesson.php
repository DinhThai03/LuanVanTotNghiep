<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lesson extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = [
        'semester_id',
        'start_date',
        'end_date',
        'day_of_week',
        'room_id',
        'start_time',
        'end_time',
        'is_active',
        'teacher_subject_id',
        'grade_status',
    ];

    protected $casts = [
        'semester_id' => 'integer',
        'day_of_week' => 'integer',
        'room_id' => 'integer',
        'teacher_subject_id' => 'integer',
        'is_active' => 'boolean',
    ];

    public function getStartTimeAttribute($value)
    {
        return Carbon::parse($value)->format('H:i');
    }

    public function getEndTimeAttribute($value)
    {
        return Carbon::parse($value)->format('H:i');
    }

    public function teacherSubject()
    {
        return $this->belongsTo(TeacherSubject::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }
}
