<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\GuardianModel;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Lesson;
use App\Models\Registration;

class DashboardController extends Controller
{
    public function stats()
    {
        // Đếm người dùng theo vai trò và giới tính
        $getCountByRole = fn($role) => [
            'male' => User::where('role', $role)->where('sex', true)->count(),
            'female' => User::where('role', $role)->where('sex', false)->count(),
        ];

        return response()->json([
            'users' => [
                'students' => $getCountByRole('student'),
                'teachers' => $getCountByRole('teacher'),
                'parents' => $getCountByRole('parent'),
                'admins' => $getCountByRole('admin'),
            ],
            'classes' => SchoolClass::count(),
            'subjects' => Subject::count(),
            'lessons' => Lesson::count(),
            'registrations' => Registration::count(),
        ]);
    }
}
