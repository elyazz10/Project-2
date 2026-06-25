<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use App\Models\BmiLog;
use App\Models\Trainer;
use App\Models\Subscription;
use App\Models\MembershipPlan;
use App\Models\PtPackage;
use App\Helpers\JWTHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class MemberController extends Controller
{
    private function getAuthUser(Request $request): ?User
    {
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        $payload = JWTHelper::decode($token);
        if (!$payload || !isset($payload['sub'])) {
            return null;
        }

        $userId = $payload['sub'];
        return \Illuminate\Support\Facades\Cache::remember('user_' . $userId, 300, function () use ($userId) {
            return User::find($userId);
        });
    }

    public function dashboard(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Active subscription
        $subscription = Subscription::with(['plan', 'trainer'])
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->orderBy('end_date', 'desc')
            ->first();

        $sisa_hari = null;
        if ($subscription) {
            $endDate = \Carbon\Carbon::parse($subscription->end_date);
            $now = \Carbon\Carbon::now();
            if ($endDate->gt($now)) {
                $sisa_hari = $now->diffInDays($endDate);
            } else {
                $sisa_hari = 0;
                $subscription->update(['status' => 'expired']);
                $subscription = null;
            }
        }

        // Bookings
        $bookings = Booking::with('trainer')
            ->where('user_id', $user->id)
            ->orderBy('booking_date', 'desc')
            ->get();

        // BMI history
        $bmiLogs = BmiLog::where('user_id', $user->id)
            ->orderBy('logged_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'whatsapp' => $user->whatsapp,
                'tanggal_lahir' => $user->tanggal_lahir ? $user->tanggal_lahir->format('Y-m-d') : null,
                'trainer_subscription_end_date' => $user->trainer_subscription_end_date,
            ],
            'active_subscription' => $subscription,
            'sisa_hari' => $sisa_hari,
            'bookings' => $bookings,
            'bmi_logs' => $bmiLogs
        ]);
    }

    public function bookTrainer(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        if (!$user->trainer_subscription_end_date || \Carbon\Carbon::parse($user->trainer_subscription_end_date)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Masa aktif langganan pelatih Anda telah berakhir. Silakan beli paket PT terlebih dahulu.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'trainer_id' => 'required|exists:trainers,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'booking_time' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = Booking::create([
            'user_id' => $user->id,
            'trainer_id' => $request->trainer_id,
            'booking_date' => $request->booking_date,
            'booking_time' => $request->booking_time,
            'status' => 'pending',
        ]);

        // Decrement the trainer session quota
        // $user->decrement('trainer_sessions'); // No longer needed for unlimited PT

        return response()->json([
            'success' => true,
            'message' => 'Sesi pelatih berhasil dipesan! Masa aktif PT Anda hingga ' . \Carbon\Carbon::parse($user->trainer_subscription_end_date)->format('d M Y') . '.',
            'booking' => $booking->load('trainer')
        ], 201);
    }

    public function cancelBooking(Request $request, $id): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $booking = Booking::where('id', $id)->where('user_id', $user->id)->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking tidak ditemukan'], 404);
        }

        if ($booking->status === 'completed') {
            return response()->json(['success' => false, 'message' => 'Tidak dapat membatalkan sesi yang sudah selesai.'], 400);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['success' => false, 'message' => 'Sesi sudah dibatalkan sebelumnya.'], 400);
        }

        $booking->status = 'cancelled';
        $booking->save();

        // Increment user's trainer sessions count
        // $user->increment('trainer_sessions'); // No longer needed

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibatalkan.',
            'trainer_subscription_end_date' => $user->trainer_subscription_end_date
        ]);
    }

    public function logBmi(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'height' => 'required|numeric|min:30|max:300',
            'weight' => 'required|numeric|min:10|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $heightMeter = $request->height / 100;
        $bmi = $request->weight / ($heightMeter * $heightMeter);
        $bmi = round($bmi, 1);

        if ($bmi < 18.5) {
            $status = 'Kurus';
        } elseif ($bmi >= 18.5 && $bmi < 25.0) {
            $status = 'Ideal';
        } elseif ($bmi >= 25.0 && $bmi < 30.0) {
            $status = 'Berlebih';
        } else {
            $status = 'Obesitas';
        }

        $bmiLog = BmiLog::create([
            'user_id' => $user->id,
            'height' => $request->height,
            'weight' => $request->weight,
            'bmi' => $bmi,
            'status' => $status,
            'logged_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengukuran BMI berhasil disimpan!',
            'bmi_log' => $bmiLog
        ], 201);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        if ($request->has('trainer_id') && $request->trainer_id === '') {
            $request->merge(['trainer_id' => null]);
        }

        $validator = Validator::make($request->all(), [
            'paket' => 'required|string',
            'trainer_id' => 'nullable|exists:trainers,id',
            'only_pt' => 'nullable|boolean',
            'pt_duration_months' => 'nullable|integer',
            'gross_amount' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $months = 1;
        if (preg_match('/(\d+)/', $request->paket, $matches)) {
            $months = intval($matches[1]);
        } else if (is_numeric($request->paket)) {
            $months = intval($request->paket);
        }
        
        if ($request->only_pt) {
            $months = 0; // Do not add any membership duration
        }

        $plan = null;
        if (!$request->only_pt) {
            $plan = MembershipPlan::where('duration_months', $months)->first();
            if (!$plan) {
                $plan = MembershipPlan::create([
                    'name' => $months . ' Bulan',
                    'duration_months' => $months,
                    'price' => $months * 100000,
                    'discount' => 0,
                    'description' => "Paket kustom selama {$months} bulan.",
                ]);
            }
        }

        $ptDurationMonths = 0;
        if ($request->filled('pt_duration_months')) {
            $ptDurationMonths = (int) $request->pt_duration_months;
        } elseif ($request->filled('sessions')) {
            $ptDurationMonths = (int) $request->sessions;
        }

        // Check if user is a first-time member
        $isFirstTimeMember = !Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'expired'])
            ->exists();
        
        $registrationFee = ($isFirstTimeMember && !$request->only_pt) ? 20000 : 0;

        // 1. Create a PENDING subscription first
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan ? $plan->id : 1, // Fallback to 1 if null, verifyPayment will ignore it if months = 0
            'trainer_id' => $request->trainer_id,
            'trainer_end_date' => $ptDurationMonths > 0 ? now()->addMonths($ptDurationMonths) : null,
            'start_date' => now(),
            'end_date' => now()->addMonths($months),
            'status' => 'pending', // Pending payment
        ]);

        $orderId = 'SUB-' . time() . '-' . $subscription->id;
        
        // Calculate the discounted price of the plan on the backend to match the frontend calculation
        $planPrice = $plan ? floatval($plan->price) : 0.0;
        if ($plan && isset($plan->discount) && $plan->discount > 0) {
            $planPrice = round($planPrice * (1 - ($plan->discount / 100)));
        }

        $grossAmount = intval($request->gross_amount);
        if ($grossAmount <= 0) {
            $grossAmount = intval($planPrice) + $registrationFee;
        }

        // Hitung biaya trainer (selisih dari total bayar dikurangi harga dasar paket membership setelah diskon dan registration fee)
        $trainerFee = max(0, $grossAmount - intval($planPrice) - $registrationFee);

        // Perbarui record subscription dengan rincian bayar & order_id
        $subscription->update([
            'order_id' => $orderId,
            'gross_amount' => $grossAmount,
            'trainer_fee' => $trainerFee,
        ]);

        \Illuminate\Support\Facades\Cache::forget('active_subscription_' . $user->id);
        \Illuminate\Support\Facades\Cache::forget('is_first_time_member_' . $user->id);

        $serverKey = env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-ToCmhhUk3VT7zUiReO5v9D1W');

        $payload = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
                'phone' => $user->whatsapp ?? '',
            ],
            'credit_card' => [
                'secure' => true
            ]
        ];

        // Dynamically detect Sandbox vs Production based on env setting, with fallback to Server Key prefix
        $isProductionEnv = env('MIDTRANS_IS_PRODUCTION');
        if ($isProductionEnv === null) {
            $isProduction = (strpos($serverKey, 'SB-') === false);
        } else {
            $isProduction = filter_var($isProductionEnv, FILTER_VALIDATE_BOOLEAN);
        }

        $midtransUrl = $isProduction 
            ? 'https://app.midtrans.com/snap/v1/transactions' 
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        try {
            // bypass SSL verification for local sandbox environment on Windows
            $response = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'Authorization' => 'Basic ' . base64_encode($serverKey . ':'),
            ])->post($midtransUrl, $payload);

            if ($response->successful()) {
                $resData = $response->json();
                return response()->json([
                    'success' => true,
                    'is_mock' => false,
                    'is_production' => $isProduction,
                    'snap_token' => $resData['token'] ?? null,
                    'redirect_url' => $resData['redirect_url'] ?? null,
                    'subscription' => $subscription->load(['plan', 'trainer'])
                ], 201);
            } else {
                // FALLBACK: If it fails (e.g. invalid server key / 401 unauthorized), fall back to Mock Simulator mode!
                return response()->json([
                    'success' => true,
                    'is_mock' => true,
                    'snap_token' => 'mock_token_' . time() . '_' . $subscription->id,
                    'redirect_url' => null,
                    'subscription' => $subscription->load(['plan', 'trainer']),
                    'debug_status' => $response->status(),
                    'debug_body' => $response->body(),
                    'message' => 'Menggunakan mode demo karena Server Key belum terkonfigurasi di .env.'
                ], 201);
            }
        } catch (\Exception $e) {
            // FALLBACK: If connection/SSL/internet fails, also fall back to Mock Simulator mode!
            return response()->json([
                'success' => true,
                'is_mock' => true,
                'snap_token' => 'mock_token_' . time() . '_' . $subscription->id,
                'redirect_url' => null,
                'subscription' => $subscription->load(['plan', 'trainer']),
                'message' => 'Menggunakan mode demo karena koneksi ke Midtrans gagal.'
            ], 201);
        }
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'whatsapp' => 'nullable|string|max:50',
            'tanggal_lahir' => 'nullable|date',
            'password' => 'nullable|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'whatsapp' => $request->whatsapp,
            'tanggal_lahir' => $request->tanggal_lahir,
        ];

        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $user->update($data);
        \Illuminate\Support\Facades\Cache::forget('user_' . $user->id);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui!',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'whatsapp' => $user->whatsapp,
                'tanggal_lahir' => $user->tanggal_lahir ? $user->tanggal_lahir->format('Y-m-d') : null,
                'role' => $user->role,
                'trainer_subscription_end_date' => $user->trainer_subscription_end_date,
            ]
        ]);
    }

    public function subscriptions(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $subscriptions = Subscription::with(['plan', 'trainer'])
            ->where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'subscriptions' => $subscriptions
        ]);
    }

    public function verifyPayment(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'subscription_id' => 'required|exists:subscriptions,id',
            'status' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $subscription = Subscription::where('id', $request->subscription_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
        }

        if ($subscription->status === 'active') {
            return response()->json([
                'success' => true,
                'message' => 'Membership sudah aktif',
                'subscription' => $subscription->load(['plan', 'trainer'])
            ]);
        }

        $trainerEndDate = $subscription->trainer_end_date;

        // Check if user already has another active subscription
        $activeSub = Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->where('id', '!=', $subscription->id)
            ->first();

        if ($activeSub) {
            // Extend existing subscription
            $endDate = \Carbon\Carbon::parse($activeSub->end_date);
            $start = $endDate->isPast() ? now() : $endDate;
            
            $diffInDays = \Carbon\Carbon::parse($subscription->start_date)->diffInDays(\Carbon\Carbon::parse($subscription->end_date));
            
            if ($diffInDays < 5) {
                // Only PT was purchased, do not change membership plan or duration
                $activeSub->update([
                    'trainer_id' => $subscription->trainer_id ?? $activeSub->trainer_id,
                ]);
                $subscription->update([
                    'status' => 'active',
                ]);
            } else {
                $plan = MembershipPlan::find($subscription->plan_id);
                $months = $plan ? $plan->duration_months : 1;
                $newEnd = $start->copy()->addMonths($months);

                $activeSub->update([
                    'end_date' => $newEnd,
                    'plan_id' => $subscription->plan_id,
                    'trainer_id' => $subscription->trainer_id ?? $activeSub->trainer_id,
                ]);
                $subscription->update([
                    'start_date' => $start,
                    'end_date' => $newEnd,
                    'status' => 'active',
                ]);
            }
        } else {
            // Activate this subscription
            $diffInDays = \Carbon\Carbon::parse($subscription->start_date)->diffInDays(\Carbon\Carbon::parse($subscription->end_date));
            if ($diffInDays < 5) {
                $subscription->update([
                    'status' => 'active',
                ]);
            } else {
                $plan = MembershipPlan::find($subscription->plan_id);
                $months = $plan ? $plan->duration_months : 1;
                $subscription->update([
                    'start_date' => now(),
                    'end_date' => now()->addMonths($months),
                    'status' => 'active',
                ]);
            }
        }

        // Add trainer duration to user
        if ($trainerEndDate) {
            $currentPtEnd = $user->trainer_subscription_end_date ? \Carbon\Carbon::parse($user->trainer_subscription_end_date) : now();
            if ($currentPtEnd->isPast()) $currentPtEnd = now();
            $addedMonths = \Carbon\Carbon::parse($subscription->start_date ?? now())->diffInMonths(\Carbon\Carbon::parse($trainerEndDate));
            if ($addedMonths == 0) $addedMonths = 1; // fallback
            $user->update(['trainer_subscription_end_date' => $currentPtEnd->addMonths($addedMonths)]);
        }

        \Illuminate\Support\Facades\Cache::forget('active_subscription_' . $user->id);
        \Illuminate\Support\Facades\Cache::forget('is_first_time_member_' . $user->id);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran terverifikasi! Membership berhasil diaktifkan.',
            'subscription' => $subscription->load(['plan', 'trainer'])
        ]);
    }

    public function checkoutData(Request $request): JsonResponse
    {
        $start = microtime(true);
        $queries = [];
        
        \Illuminate\Support\Facades\DB::listen(function ($query) use (&$queries) {
            $queries[] = [
                'sql' => $query->sql,
                'bindings' => $query->bindings,
                'time' => $query->time // in milliseconds
            ];
        });

        $authStart = microtime(true);
        $user = $this->getAuthUser($request);
        $authTime = (microtime(true) - $authStart) * 1000;

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // 1. Get trainers (cached)
        $trainersStart = microtime(true);
        $trainers = \Illuminate\Support\Facades\Cache::remember('public_trainers', 86400, function () {
            return Trainer::where('role', 'trainer')->get();
        });
        $trainersTime = (microtime(true) - $trainersStart) * 1000;

        // 2. Get membership plans (cached)
        $plansStart = microtime(true);
        $plans = \Illuminate\Support\Facades\Cache::remember('public_membership_plans', 86400, function () {
            return MembershipPlan::orderBy('duration_months', 'asc')->get();
        });
        $plansTime = (microtime(true) - $plansStart) * 1000;

        // 3. Get PT packages (cached)
        $ptPackagesStart = microtime(true);
        $ptPackages = \Illuminate\Support\Facades\Cache::remember('public_pt_packages', 86400, function () {
            return PtPackage::where('is_active', true)->orderBy('duration_months', 'asc')->get();
        });
        $ptPackagesTime = (microtime(true) - $ptPackagesStart) * 1000;

        // 4. Get active subscription (cached per user for 60 seconds)
        $activeSubStart = microtime(true);
        $activeSubscription = \Illuminate\Support\Facades\Cache::remember('active_subscription_' . $user->id, 60, function () use ($user) {
            return Subscription::with(['plan', 'trainer'])
                ->where('user_id', $user->id)
                ->where('status', 'active')
                ->orderBy('end_date', 'desc')
                ->first();
        });
        $activeSubTime = (microtime(true) - $activeSubStart) * 1000;

        // 5. Check if user is a first-time member (cached per user for 60 seconds)
        $isFirstTimeStart = microtime(true);
        $isFirstTimeMember = !Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'expired'])
            ->exists();
        $isFirstTimeTime = (microtime(true) - $isFirstTimeStart) * 1000;

        $totalTime = (microtime(true) - $start) * 1000;

        return response()->json([
            'success' => true,
            'trainers' => $trainers,
            'plans' => $plans,
            'pt_packages' => $ptPackages,
            'active_subscription' => $activeSubscription,
            'is_first_time_member' => $isFirstTimeMember,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'whatsapp' => $user->whatsapp,
                'trainer_subscription_end_date' => $user->trainer_subscription_end_date,
            ],
            'profiling' => [
                'auth_time_ms' => $authTime,
                'trainers_fetch_time_ms' => $trainersTime,
                'plans_fetch_time_ms' => $plansTime,
                'pt_packages_fetch_time_ms' => $ptPackagesTime,
                'active_sub_fetch_time_ms' => $activeSubTime,
                'first_time_check_time_ms' => $isFirstTimeTime,
                'total_controller_time_ms' => $totalTime,
                'queries' => $queries
            ]
        ]);
    }

    public function handleNotification(Request $request): JsonResponse
    {
        $payload = $request->all();
        $orderId = $payload['order_id'] ?? null;
        $transactionStatus = $payload['transaction_status'] ?? null;
        $statusCode = $payload['status_code'] ?? null;
        $grossAmount = $payload['gross_amount'] ?? null;
        $signatureKey = $payload['signature_key'] ?? null;

        if (!$orderId) {
            return response()->json(['success' => false, 'message' => 'Invalid payload'], 400);
        }

        // Verify Signature
        $serverKey = env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-ToCmhhUk3VT7zUiReO5v9D1W');
        $localSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);
        if ($localSignature !== $signatureKey) {
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 403);
        }

        $subscription = Subscription::where('order_id', $orderId)->first();
        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Subscription not found'], 404);
        }

        if ($transactionStatus === 'settlement' || $transactionStatus === 'capture') {
            if ($subscription->status !== 'active') {
                $user = User::find($subscription->user_id);
                if ($user) {
                    $trainerEndDate = $subscription->trainer_end_date;
                    
                    $activeSub = Subscription::where('user_id', $user->id)
                        ->where('status', 'active')
                        ->where('id', '!=', $subscription->id)
                        ->first();

                    if ($activeSub) {
                        $endDate = \Carbon\Carbon::parse($activeSub->end_date);
                        $start = $endDate->isPast() ? now() : $endDate;
                        
                        $diffInDays = \Carbon\Carbon::parse($subscription->start_date)->diffInDays(\Carbon\Carbon::parse($subscription->end_date));
                        
                        if ($diffInDays < 5) {
                            $activeSub->update([
                                'trainer_id' => $subscription->trainer_id ?? $activeSub->trainer_id,
                            ]);
                            $subscription->update([
                                'status' => 'active',
                            ]);
                        } else {
                            $plan = MembershipPlan::find($subscription->plan_id);
                            $months = $plan ? $plan->duration_months : 1;
                            $newEnd = $start->copy()->addMonths($months);

                            $activeSub->update([
                                'end_date' => $newEnd,
                                'plan_id' => $subscription->plan_id,
                                'trainer_id' => $subscription->trainer_id ?? $activeSub->trainer_id,
                            ]);
                            $subscription->update([
                                'start_date' => $start,
                                'end_date' => $newEnd,
                                'status' => 'active',
                            ]);
                        }
                    } else {
                        $diffInDays = \Carbon\Carbon::parse($subscription->start_date)->diffInDays(\Carbon\Carbon::parse($subscription->end_date));
                        if ($diffInDays < 5) {
                            $subscription->update([
                                'status' => 'active',
                            ]);
                        } else {
                            $plan = MembershipPlan::find($subscription->plan_id);
                            $months = $plan ? $plan->duration_months : 1;
                            $subscription->update([
                                'start_date' => now(),
                                'end_date' => now()->addMonths($months),
                                'status' => 'active',
                            ]);
                        }
                    }

                    // Add trainer duration to user
                    if ($trainerEndDate) {
                        $currentPtEnd = $user->trainer_subscription_end_date ? \Carbon\Carbon::parse($user->trainer_subscription_end_date) : now();
                        if ($currentPtEnd->isPast()) $currentPtEnd = now();
                        $addedMonths = \Carbon\Carbon::parse($subscription->start_date ?? now())->diffInMonths(\Carbon\Carbon::parse($trainerEndDate));
                        if ($addedMonths == 0) $addedMonths = 1; // fallback
                        $user->update(['trainer_subscription_end_date' => $currentPtEnd->addMonths($addedMonths)]);
                    }
                }
            }
        } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
            $subscription->update([
                'status' => 'cancelled',
            ]);
        }

        \Illuminate\Support\Facades\Cache::forget('active_subscription_' . $subscription->user_id);
        \Illuminate\Support\Facades\Cache::forget('is_first_time_member_' . $subscription->user_id);

        return response()->json(['success' => true]);
    }
}

