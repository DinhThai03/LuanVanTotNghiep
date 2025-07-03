<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'registration_id';
    protected $fillable = [
        'registration_id',
        'process_score',
        'midterm_score',
        'final_score',
    ];



    public function registration()
    {
        return $this->belongsTo(Registration::class, 'registration_id');
    }

    protected $appends = ['average_score', 'letter_grade', 'result']; // Tự động thêm vào JSON

    public function getAverageScoreAttribute()
    {
        if (is_null($this->final_score)) {
            return null;
        }
        $process = floatval($this->process_score ?? 0);
        $midterm = floatval($this->midterm_score ?? 0);
        $final = floatval($this->final_score ?? 0);

        $subject = optional($this->registration?->lesson?->teacherSubject?->subject);
        $process_percent = floatval($subject->process_percent ?? 0);
        $midterm_percent = floatval($subject->midterm_percent ?? 0);
        $final_percent = floatval($subject->final_percent ?? 0);

        $total = ($process * $process_percent + $midterm * $midterm_percent + $final * $final_percent) / 100;

        return round($total, 2);
    }

    public function getLetterGradeAttribute()
    {
        if (is_null($this->final_score)) {
            return null;
        }
        $avg = $this->average_score;

        return match (true) {
            $avg >= 8.5 => 'A',
            $avg >= 7.0 => 'B',
            $avg >= 5.5 => 'C',
            $avg >= 4.0 => 'D',
            default => 'F',
        };
    }

    public function getResultAttribute(): ?string
    {
        if (is_null($this->final_score)) {
            return null;
        }
        $avg = $this->average_score;

        return $avg >= 5.0 ? 1 : 0;
    }
}
