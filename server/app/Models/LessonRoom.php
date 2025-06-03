<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonRoom extends Model
{
    protected $table = 'lesson_rooms';

    protected $fillable = [
        'lesson_id',
        'room_id',
        'start_time',
        'end_time',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }
}
