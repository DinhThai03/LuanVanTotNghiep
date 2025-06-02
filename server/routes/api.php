<?php

use App\Http\Controllers\Api\Academic\AcademicYearController;
use App\Http\Controllers\Api\Academic\ClassController;
use App\Http\Controllers\Api\Academic\FacultyController;
use App\Http\Controllers\Api\Academic\FacultySubjectController;
use App\Http\Controllers\Api\Academic\SemesterController;
use App\Http\Controllers\Api\Academic\SemesterSubjectController;
use App\Http\Controllers\Api\Academic\SubjectController;
use App\Http\Controllers\Api\Profile\PasswordController;
use App\Http\Controllers\Api\User\StudentController;
use App\Http\Controllers\Api\User\AdminController;
use App\Http\Controllers\Api\User\AuthController;
use App\Http\Controllers\Api\User\GuardianController;
use App\Http\Controllers\Api\User\TeacherController;
use App\Http\Controllers\Api\User\UserController;
use Illuminate\Support\Facades\Route;

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    Route::post('change_password', [PasswordController::class, 'changeUserPassword']);

    Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

Route::middleware(['auth'])->group(function () {
    //============== USER ==============
    Route::get('users', [UserController::class, 'index']);
    Route::get('user/{id}', [UserController::class, 'show']);
    Route::post('user', [UserController::class, 'store']);
    Route::post('user/{id}', [UserController::class, 'update']);
    Route::delete('user/{id}', [UserController::class, 'destroy']);

    //============== ADMIN ==============
    Route::get('admins', [AdminController::class, 'index']);
    Route::get('admin/{user_id}', [AdminController::class, 'show']);
    Route::post('admin', [AdminController::class, 'store']);
    Route::post('admin/{user_id}', [AdminController::class, 'update']);
    Route::delete('admin/{user_id}', [AdminController::class, 'destroy']);

    //============== TEACHER ==============
    Route::get('teachers', [TeacherController::class, 'index']);
    Route::get('teacher/{code}', [TeacherController::class, 'show']);
    Route::post('teacher', [TeacherController::class, 'store']);
    Route::post('teacher/{code}', [TeacherController::class, 'update']);
    Route::delete('teacher/{code}', [TeacherController::class, 'destroy']);


    //============== STUDENT ==============
    Route::get('students', [StudentController::class, 'index']);
    Route::get('student/{code}', [StudentController::class, 'show']);
    Route::post('student', [StudentController::class, 'store']);
    Route::post('student/{code}', [StudentController::class, 'update']);
    Route::delete('student/{code}', [StudentController::class, 'destroy']);

    //============== PARENT ==============
    Route::get('guardians', [GuardianController::class, 'index']);
    Route::get('guardian/{id}', [GuardianController::class, 'show']);
    Route::post('guardian', [GuardianController::class, 'store']);
    Route::post('guardian/{id}', [GuardianController::class, 'update']);
    Route::delete('guardian/{id}', [GuardianController::class, 'destroy']);

    //============== ACADEMIC YEAR ==============
    Route::get('academic_years', [AcademicYearController::class, 'index']);
    Route::get('academic_year/{id}', [AcademicYearController::class, 'show']);
    Route::post('academic_year', [AcademicYearController::class, 'store']);
    Route::post('academic_year/{id}', [AcademicYearController::class, 'update']);
    Route::delete('academic_year/{id}', [AcademicYearController::class, 'destroy']);

    //============== SEMESTER ==============
    Route::get('semesters', [SemesterController::class, 'index']);
    Route::get('semester/{id}', [SemesterController::class, 'show']);
    Route::post('semester', [SemesterController::class, 'store']);
    Route::post('semester/{id}', [SemesterController::class, 'update']);
    Route::delete('semester/{id}', [SemesterController::class, 'destroy']);

    //============== SUBJECT ==============
    Route::get('subjects', [SubjectController::class, 'index']);
    Route::get('subject/{id}', [SubjectController::class, 'show']);
    Route::post('subject', [SubjectController::class, 'store']);
    Route::post('subject/{id}', [SubjectController::class, 'update']);
    Route::delete('subject/{id}', [SubjectController::class, 'destroy']);

    //============== SEMESTER_SUBJECT ==============
    Route::get('semester_subjects', [SemesterSubjectController::class, 'index']);
    Route::get('semester_subject/{id}', [SemesterSubjectController::class, 'show']);
    Route::post('semester_subject', [SemesterSubjectController::class, 'store']);
    Route::post('semester_subject/{id}', [SemesterSubjectController::class, 'update']);
    Route::delete('semester_subject/{id}', [SemesterSubjectController::class, 'destroy']);

    //============== CLASS ==============
    Route::get('classed', [ClassController::class, 'index']);
    Route::get('class/{id}', [ClassController::class, 'show']);
    Route::post('class', [ClassController::class, 'store']);
    Route::post('class/{id}', [ClassController::class, 'update']);
    Route::delete('class/{id}', [ClassController::class, 'destroy']);

    //============== FACULTY ==============
    Route::get('facultys', [FacultyController::class, 'index']);
    Route::get('faculty/{id}', [FacultyController::class, 'show']);
    Route::post('faculty', [FacultyController::class, 'store']);
    Route::post('faculty/{id}', [FacultyController::class, 'update']);
    Route::delete('faculty/{id}', [FacultyController::class, 'destroy']);

    //============== FACULTY_SUBJECT ==============
    Route::get('faculty_subjects', [FacultySubjectController::class, 'index']);
    Route::get('faculty_subject/{id}', [FacultySubjectController::class, 'show']);
    Route::post('faculty_subject', [FacultySubjectController::class, 'store']);
    Route::post('faculty_subject/{id}', [FacultySubjectController::class, 'update']);
    Route::delete('faculty_subject/{id}', [FacultySubjectController::class, 'destroy']);
});
