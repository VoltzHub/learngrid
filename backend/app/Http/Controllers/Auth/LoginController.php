<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Please verify your email first.',
            ], 403);
        }

        $remember = $validated['remember'] ?? false;

        $expiresAt = $remember
            ? now()->addDays(30)
            : now()->addDay();

        $token = $user->createToken(
            'learn-grid',
            ['*'],
            $expiresAt
        )->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }
}