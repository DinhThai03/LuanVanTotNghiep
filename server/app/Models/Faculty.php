<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $fillable = [
        'name',
    ];

    public function classes()
    {
        return $this->hasMany(SchoolClass::class, 'faculty_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'faculty_subjects', 'faculty_id', 'subject_id');
    }
}
