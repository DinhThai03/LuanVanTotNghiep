<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacultySubject extends Model
{
    protected $table = 'faculty_subjects';

    

    protected $fillable = [
        'year',
        'subject_id',
        'faculty_id',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
}
