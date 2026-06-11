<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/status', function () {
    return response()->json([
        'status' => 'online',
        'message' => 'Laravel backend connected successfully!',
        'database' => config('database.default'),
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    $username = $credentials['username'];
    $password = $credentials['password'];

    // 1. Try Database authentication
    try {
        $user = User::where('email', $username)->first();
        if ($user && Hash::check($password, $user->password)) {
            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ]);
        }
    } catch (\Exception $e) {
        // Fallback silently if DB is not set up
    }

    // 2. Hardcoded fallback authentication
    $fallbackUsers = [
        'admin' => ['password' => 'admin123', 'name' => 'System Administrator', 'role' => 'admin'],
        'teacher' => ['password' => 'guru123', 'name' => 'English Teacher', 'role' => 'teacher'],
        'student' => ['password' => 'murid123', 'name' => 'Active Student', 'role' => 'student'],
    ];

    if (isset($fallbackUsers[$username]) && $fallbackUsers[$username]['password'] === $password) {
        $fallback = $fallbackUsers[$username];
        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => 999,
                'name' => $fallback['name'],
                'email' => $username,
                'role' => $fallback['role'],
            ],
        ]);
    }

    return response()->json([
        'status' => 'error',
        'message' => 'Username atau password salah.',
    ], 401);
});
