<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class VerifyEmailController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'digits:6'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified.',
            ], 422);
        }

        if (
            !$user->verification_code_expires_at ||
            now()->greaterThan($user->verification_code_expires_at)
        ) {
            return response()->json([
                'message' => 'Verification code has expired.',
            ], 422);
        }

        if (!Hash::check($validated['code'], $user->verification_code)) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 422);
        }

        $user->update([
            'email_verified_at' => now(),
            'verification_code' => null,
            'verification_code_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'Email verified successfully.',
        ]);
    }
}