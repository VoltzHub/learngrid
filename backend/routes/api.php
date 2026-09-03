<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [RegisterController::class, 'register']);


Route::post('/send-verification-code', [
    EmailVerificationController::class,
    'sendCode'
]);

Route::post('/verify-email', [
    EmailVerificationController::class,
    'verify'
]);


Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);


Route::post('/forgot-password', [
    ForgotPasswordController::class,
    'sendCode',
]);

Route::post('/verify-reset-code', [
    ForgotPasswordController::class,
    'verifyCode',
]);