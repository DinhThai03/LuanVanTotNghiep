<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name',
        'size',
        'room_type',
        'is_active',
    ];

    public function examClassRooms()
    {
        return $this->hasMany(ExamClassRoom::class, 'room_id');
    }
}
