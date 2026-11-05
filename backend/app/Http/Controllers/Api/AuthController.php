<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $isSuperAdmin = in_array(strtolower($request->email), [
            'shere0991@gmail.com',
            'admin@softcredible.com',
            'admin@porichoyid.softcredible.com',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $isSuperAdmin ? 'super_admin' : 'user',
            'plan' => 'starter',
            'plan_name' => 'Starter Plan',
            'subscription_status' => 'active',
            'subscription_ends_at' => now()->addDays(30),
            'badge_limit' => 25,
            'billing_cycle' => 'monthly',
        ]);

        // Record initial subscription log
        $user->subscriptions()->create([
            'plan' => 'starter',
            'plan_name' => 'Starter Plan',
            'price' => 0.00,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addDays(30),
            'payment_method' => 'free_trial',
            'transaction_id' => 'TRIAL-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login a user.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Update the authenticated user's profile (name / email / password).
     */
    public function updateUser(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'user' => $user,
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * Logout current session.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
