<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admins';

    protected $primaryKey = 'user_id';

    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'admin_level',
    ];

    // Quan hệ 1-1 với User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
