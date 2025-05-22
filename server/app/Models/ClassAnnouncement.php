<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassAnnouncement extends Model
{
    protected $table = 'class_announcements';

    

    protected $primaryKey = null;  // Vì không có cột id riêng

    public $incrementing = false;

    protected $fillable = [
        'class_id',
        'announcement_id',
    ];

    // Quan hệ với lớp học
    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    // Quan hệ với thông báo
    public function announcement()
    {
        return $this->belongsTo(Announcement::class, 'announcement_id');
    }
}
