<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\ResendVerificationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {

    Route::post('/register', [RegisterController::class, 'store']);

    Route::post('/verify-email', [VerifyEmailController::class, 'store']);

    Route::post('/login', [LoginController::class, 'store']);

        Route::post('/forgot-password', [
        ForgotPasswordController::class,
        'store'
    ]);

    Route::post('/reset-password', [
        ResetPasswordController::class,
        'store'
    ]);


    Route::post('/resend-verification', [
        ResendVerificationController::class,
        'store'
    ]);

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::post('/logout', [
            LoginController::class,
            'destroy'
        ]);

    });
});