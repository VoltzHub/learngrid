<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Mail\VerificationCodeMail;
use Illuminate\Support\Facades\Mail;

class RegisterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $code = random_int(100000, 999999);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'verification_code' => Hash::make($code),
            'verification_code_expires_at' => now()->addMinutes(10),
        ]);


        Mail::to($user->email)
            ->send(new VerificationCodeMail($code));

        return response()->json([
            'message' => 'Account created. Verification code sent.',
        ], 201);
    }
}