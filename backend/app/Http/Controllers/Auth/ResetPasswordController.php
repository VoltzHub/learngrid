<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $reset = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (!$reset) {
            return response()->json([
                'message' => 'Invalid or expired reset link.',
            ], 422);
        }

        if (!Hash::check($validated['token'], $reset->token)) {
            return response()->json([
                'message' => 'Invalid or expired reset link.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid or expired reset link.',
            ], 422);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->delete();

        return response()->json([
            'message' => 'Password reset successfully.',
        ]);
    }
}