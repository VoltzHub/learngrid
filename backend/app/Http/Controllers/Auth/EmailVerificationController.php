<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmailCodeMail;
use App\Models\EmailVerificationCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class EmailVerificationController extends Controller
{
    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email is already verified.'
            ], 400);
        }

        // Delete old verification codes
        EmailVerificationCode::where('user_id', $user->id)->delete();

        // Generate 6-digit code
        $code = (string) random_int(100000, 999999);

        // Store hashed code
        EmailVerificationCode::create([
            'user_id' => $user->id,
            'code' => Hash::make($code),
            'expires_at' => now()->addMinutes(10),
        ]);

        // Send email
        Mail::to($user->email)->send(
            new VerifyEmailCodeMail($code)
        );

        return response()->json([
            'message' => 'Verification code sent successfully.'
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email is already verified.'
            ], 400);
        }

        $verification = EmailVerificationCode::where(
            'user_id',
            $user->id
        )->latest()->first();

        if (!$verification) {
            return response()->json([
                'message' => 'Verification code not found.'
            ], 404);
        }

        if (now()->greaterThan($verification->expires_at)) {
            return response()->json([
                'message' => 'Verification code has expired.'
            ], 422);
        }

        if (!Hash::check($request->code, $verification->code)) {
            return response()->json([
                'message' => 'Invalid verification code.'
            ], 422);
        }

        // Mark email as verified
        $user->update([
            'email_verified_at' => now(),
        ]);

        // Delete used code
        $verification->delete();

        return response()->json([
            'message' => 'Email verified successfully.'
        ]);
    }
}