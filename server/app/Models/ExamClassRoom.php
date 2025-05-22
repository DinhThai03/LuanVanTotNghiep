<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamClassRoom extends Model
{
    protected $table = 'exam_class_rooms';

    protected $fillable = [
        'exam_schedule_id',
        'room_id',
        'class_id',
        'start_seat',
        'end_seat',
    ];

    

    public function examSchedule()
    {
        return $this->belongsTo(ExamSchedule::class, 'exam_schedule_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }
}
