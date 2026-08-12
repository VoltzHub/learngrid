<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;

class ForgotPasswordController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'If that email exists, a reset link has been sent.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            [
                'email' => $user->email,
            ],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

       $resetUrl = 'https://learngrid-eta.vercel.app/reset-password?token='
        . $token
        . '&email='
        . urlencode($user->email);


        Mail::to($user->email)
        ->send(new PasswordResetMail($resetUrl));

        return response()->json([
            'message' => 'If that email exists, a reset link has been sent.',
        ]);
    }
}