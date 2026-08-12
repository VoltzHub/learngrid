<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\VerificationCodeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class ResendVerificationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $key = 'resend-verification:' . $validated['email'];

        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json([
                'message' => 'Too many requests. Please try again later.',
                'seconds' => RateLimiter::availableIn($key),
            ], 429);
        }

        RateLimiter::hit($key, 60);

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (!$user) {
            return response()->json([
                'message' => 'If that email exists, a verification code has been sent.',
            ]);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email is already verified.',
            ], 422);
        }

        $code = random_int(100000, 999999);

        $user->update([
            'verification_code' => Hash::make($code),
            'verification_code_expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)
            ->send(new VerificationCodeMail($code));

        return response()->json([
            'message' => 'A new verification code has been sent.',
        ]);
    }
}