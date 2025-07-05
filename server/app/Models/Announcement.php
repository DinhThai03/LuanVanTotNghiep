<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'content',
        'date',
        'target_type',
        'file_path',
    ];

    protected $with = ['classes'];

    // Quan hệ nhiều-nhiều với lớp học (classes) qua bảng class_announcements
    public function classes()
    {
        return $this->belongsToMany(
            SchoolClass::class,
            'class_announcements',
            'announcement_id',
            'class_id'
        );
    }
}
