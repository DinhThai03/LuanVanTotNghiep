<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    public $timestamps = false;

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

    public function teachers()
    {
        return $this->hasMany(Teacher::class, 'faculty_id');
    }
    public function registrationPeriods()
    {
        return $this->hasMany(RegistrationPeriod::class);
    }
}
