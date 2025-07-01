<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cohort extends Model
{
    use HasFactory;

    protected $table = 'cohorts';

    // Cho phép gán hàng loạt
    protected $fillable = [
        'name',
        'start_year',
        'end_year',
    ];

    /**
     * Quan hệ 1-n: Cohort có nhiều lớp học (classes)
     */
    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }

    /**
     * Lấy toàn bộ sinh viên thông qua các lớp của cohort
     */
    public function students()
    {
        return $this->hasManyThrough(
            Student::class,
            SchoolClass::class,
            'cohort_id',
            'class_id',
            'id',
            'id'
        );
    }

    /**
     * Scope lọc theo năm bắt đầu (hoặc các scope tùy chọn)
     */
    public function scopeByStartYear($query, $year)
    {
        return $query->where('start_year', $year);
    }

    /**
     * Tên hiển thị đầy đủ ví dụ: "K2021 (2021–2025)"
     */
    public function getFullNameAttribute()
    {
        return "{$this->name} ({$this->start_year}–{$this->end_year})";
    }
}
