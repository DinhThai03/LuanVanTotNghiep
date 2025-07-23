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


    public function canGraduate(): bool
    {
        $registrations = $this->registrations()->with('grade', 'lesson.teacherSubject.subject')->get();

        $totalCredits = 0;

        foreach ($registrations as $reg) {
            $grade = $reg->grade;
            $subject = optional($reg->lesson->teacherSubject->subject);

            if ($grade && $grade->result == 1) {
                $totalCredits += intval($subject->credit ?? 0);
            }
        }

        $facultyId = $this->schoolClass?->faculty_id;
        $cohortId = $this->schoolClass?->cohort_id;

        $requiredCredit = RequiredCredit::where('faculty_id', $facultyId)
            ->where('cohort_id', $cohortId)
            ->value('required_credit');

        if (!$requiredCredit) {
            return false;
        }

        return $totalCredits >= $requiredCredit;
    }

    public function getGraduationRank(): ?string
    {
        $registrations = $this->registrations()->with('grade', 'lesson.teacherSubject.subject')->get();

        $totalCredits = 0;
        $totalWeightedScore = 0;

        foreach ($registrations as $reg) {
            $grade = $reg->grade;
            $subject = optional($reg->lesson->teacherSubject->subject);
            $credit = intval($subject->credit ?? 0);
            $avgScore = $grade->average_score;

            if ($grade && $grade->result == 1 && $avgScore !== null) {
                $totalCredits += $credit;
                $totalWeightedScore += $avgScore * $credit;
            }
        }

        if ($totalCredits === 0) {
            return null;
        }

        $gpa = $totalWeightedScore / $totalCredits;

        return match (true) {
            $gpa >= 3.6 => 'Xuất sắc',
            $gpa >= 3.2 => 'Giỏi',
            $gpa >= 2.5 => 'Khá',
            $gpa >= 2.0 => 'Trung bình',
            default => 'Không đạt',
        };
    }
}
