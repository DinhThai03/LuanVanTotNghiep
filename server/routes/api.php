<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login',[AuthController::class, 'login']);
    Route::get('profile',[AuthController::class, 'profile']);
    Route::post('logout',[AuthController::class, 'logout']);
    Route::post('refresh',[AuthController::class, 'refresh']);
});
