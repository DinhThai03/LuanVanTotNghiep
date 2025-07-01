<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuardianModel extends Model
{
    protected $table = 'parents';
    public $timestamps = false;

    protected $primaryKey = 'user_id';
    public $incrementing = false; // vì user_id không phải auto increment
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'student_code',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_code', 'code');
    }
}
