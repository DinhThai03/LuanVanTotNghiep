<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = [
        'username',
        'password',
        'role',
        'email',
        'date_of_birth',
        'full_name',
        'address',
        'phone',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // Quan hệ với Teacher
    public function teacher()
    {
        return $this->hasOne(Teacher::class, 'user_id');
    }

    // Quan hệ với Admin
    public function admin()
    {
        return $this->hasOne(Admin::class, 'user_id');
    }

    // Quan hệ với Student
    public function student()
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    // Quan hệ với ParentModel
    public function parentModel()
    {
        return $this->hasOne(ParentModel::class, 'user_id');
    }
}
