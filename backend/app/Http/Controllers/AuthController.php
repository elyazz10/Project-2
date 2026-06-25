<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subscription;
use App\Models\MembershipPlan;
use App\Helpers\JWTHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'whatsapp' => 'nullable|string|max:50',
            'tanggal_lahir' => 'nullable|date',
            'paket' => 'nullable|string' // default package chosen during registration
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'whatsapp' => $request->whatsapp,
            'tanggal_lahir' => $request->tanggal_lahir,
            'role' => 'member',
        ]);

        // Auto subscribe to a default plan if package chosen (e.g. 6 months, 12 months, 18 months, 24 months)
        if ($request->filled('paket')) {
            $planMap = [
                '1bulan' => 1,
                '3bulan' => 3,
                '6bulan' => 6,
                '12bulan' => 12,
                '18bulan' => 18,
                '24bulan' => 24
            ];
            $months = $planMap[$request->paket] ?? 6;
            $plan = MembershipPlan::where('duration_months', $months)->first();
            
            if ($plan) {
                Subscription::create([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'start_date' => now(),
                    'end_date' => now()->addMonths($months),
                    'status' => 'active',
                ]);
            }
        }

        $token = JWTHelper::encode([
            'sub' => $user->id,
            'role' => $user->role,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24 * 7) // 7 days expiration
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User successfully registered!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah!'
            ], 401);
        }

        $token = JWTHelper::encode([
            'sub' => $user->id,
            'role' => $user->role,
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24 * 7) // 7 days
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login sukses!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'whatsapp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akun dengan email tersebut tidak ditemukan.'
            ], 404);
        }

        // Normalize WhatsApp numbers for comparison (strip leading 0 or +62)
        $normalizeWa = function ($wa) {
            $wa = preg_replace('/[^0-9]/', '', $wa);
            if (str_starts_with($wa, '62')) {
                $wa = substr($wa, 2);
            }
            if (str_starts_with($wa, '0')) {
                $wa = substr($wa, 1);
            }
            return $wa;
        };

        $inputWa = $normalizeWa($request->whatsapp);
        $userWa = $normalizeWa($user->whatsapp ?? '');

        if (!$userWa || $inputWa !== $userWa) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp tidak cocok dengan akun yang terdaftar.'
            ], 403);
        }

        // Generate a short-lived reset token (15 min)
        $resetToken = JWTHelper::encode([
            'sub' => $user->id,
            'purpose' => 'password_reset',
            'iat' => time(),
            'exp' => time() + (60 * 15)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil! Silakan atur password baru Anda.',
            'reset_token' => $resetToken,
            'user_name' => $user->name
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'reset_token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payload = JWTHelper::decode($request->reset_token);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token reset tidak valid atau sudah kedaluwarsa. Silakan ulangi proses lupa password.'
            ], 401);
        }

        if (!isset($payload['purpose']) || $payload['purpose'] !== 'password_reset') {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid untuk reset password.'
            ], 401);
        }

        $user = User::find($payload['sub']);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.'
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil direset! Silakan login dengan password baru Anda.'
        ]);
    }
}
