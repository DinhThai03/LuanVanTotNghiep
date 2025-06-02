<?php

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
    Route::get('user', [UserController::class, 'index']);
    Route::get('user/{id}', [UserController::class, 'show']);
    Route::post('user', [UserController::class, 'store']);
    Route::post('user/{id}', [UserController::class, 'update']);
    Route::delete('user/{id}', [UserController::class, 'destroy']);

    //============== ADMIN ==============
    Route::get('admin', [AdminController::class, 'index']);
    Route::get('admin/{user_id}', [AdminController::class, 'show']);
    Route::post('admin', [AdminController::class, 'store']);
    Route::post('admin/{user_id}', [AdminController::class, 'update']);
    Route::delete('admin/{user_id}', [AdminController::class, 'destroy']);

    //============== TEACHER ==============
    Route::get('teacher', [TeacherController::class, 'index']);
    Route::get('teacher/{code}', [TeacherController::class, 'show']);
    Route::post('teacher', [TeacherController::class, 'store']);
    Route::post('teacher/{code}', [TeacherController::class, 'update']);
    Route::delete('teacher/{code}', [TeacherController::class, 'destroy']);


    //============== STUDENT ==============
    Route::get('student', [StudentController::class, 'index']);
    Route::get('student/{code}', [StudentController::class, 'show']);
    Route::post('student', [StudentController::class, 'store']);
    Route::post('student/{code}', [StudentController::class, 'update']);
    Route::delete('student/{code}', [StudentController::class, 'destroy']);

    //============== Parent ==============
    Route::get('guardian', [GuardianController::class, 'index']);
    Route::get('guardian/{id}', [GuardianController::class, 'show']);
    Route::post('guardian', [GuardianController::class, 'store']);
    Route::post('guardian/{id}', [GuardianController::class, 'update']);
    Route::delete('guardian/{id}', [GuardianController::class, 'destroy']);
});
