<?php

namespace App\Models;

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

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

    // Quan hệ với GuardianModel
    public function Guardian()
    {
        return $this->hasOne(GuardianModel::class, 'user_id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
