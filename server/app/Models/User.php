<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'role',
        'email',
        'date_of_birth',
        'first_name',
        'last_name',
        'sex',
        'address',
        'phone',
        'identity_number',
        'issued_date',
        'issued_place',
        'ethnicity',
        'religion',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'issued_date' => 'date',
        'sex' => 'boolean',
        'is_active' => 'boolean',
    ];

    // === Relationships ===

    public function teacher()
    {
        return $this->hasOne(Teacher::class, 'user_id');
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'user_id');
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id');
    }

    public function guardian()
    {
        return $this->hasOne(GuardianModel::class, 'user_id');
    }

    // === JWT Methods ===

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'is_active' => $this->is_active,
        ];
    }

    // === Notifications ===
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    // === Accessors (Optional) ===

    public function getFullNameAttribute()
    {
        return "{$this->last_name} {$this->first_name}";
    }
}
