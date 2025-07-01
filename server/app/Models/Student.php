<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $primaryKey = 'code';     // Khóa chính là code kiểu CHAR(10)
    public $incrementing = false;       // Không tự tăng
    protected $keyType = 'string';      // Kiểu khóa chính là string
    public $timestamps = false;

    protected $fillable = [
        'code',
        'class_id',
        'user_id',
        'place_of_birth',
        'status', // Thêm vào fillable
    ];

    protected $casts = [
        'status' => 'string',
    ];

    // === Relationships ===

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function parents()
    {
        return $this->hasMany(GuardianModel::class, 'student_code', 'code');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class, 'student_code', 'code');
    }

    // === Accessor: hiển thị trạng thái bằng tiếng Việt ===

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'studying' => 'Đang học',
            'paused' => 'Nghỉ học',
            'graduated' => 'Tốt nghiệp',
            default => 'Không xác định',
        };
    }
}
