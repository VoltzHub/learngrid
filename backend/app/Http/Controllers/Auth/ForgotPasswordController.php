<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetCodeMail;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No account was found with that email address.',
            ], 404);
        }

        PasswordResetCode::where('email', $user->email)->delete();

       $code = (string) random_int(1000, 9999);

        PasswordResetCode::create([
            'email' => $user->email,
            'code' => Hash::make($code),
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(
            new PasswordResetCodeMail($code)
        );

        return response()->json([
            'message' => 'Password reset code sent successfully.',
        ]);
    }
    public function verifyCode(Request $request)
{
    $request->validate([
        'email' => ['required', 'email'],
        'code' => ['required', 'digits:4'],
    ]);

    $resetCode = PasswordResetCode::where(
        'email',
        $request->email
    )->latest()->first();

    if (!$resetCode) {
        return response()->json([
            'message' => 'Reset code not found.',
        ], 404);
    }

    if (now()->greaterThan($resetCode->expires_at)) {
        $resetCode->delete();

        return response()->json([
            'message' => 'Reset code has expired.',
        ], 422);
    }

    if (!Hash::check($request->code, $resetCode->code)) {
        return response()->json([
            'message' => 'Invalid reset code.',
        ], 422);
    }

    return response()->json([
        'message' => 'Reset code verified successfully.',
    ]);
}
}