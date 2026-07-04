<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use App\Models\Trainer;
use App\Models\Subscription;
use App\Models\MembershipPlan;
use App\Helpers\JWTHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    private function verifyAdmin(Request $request): ?User
    {
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        $payload = JWTHelper::decode($token);
        if (!$payload || !isset($payload['sub']) || !in_array($payload['role'], ['admin', 'owner'])) {
            return null;
        }

        return User::find($payload['sub']);
    }

    public function dashboardStats(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $totalMembers = User::where('role', 'member')->count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $approvedBookings = Booking::where('status', 'approved')->count();
        $totalTrainers = Trainer::count();

        // Calculate approximate gross revenue from active subscriptions
        $subRevenue = Subscription::where('status', 'active')
            ->selectRaw('SUM(CASE WHEN gross_amount > 0 THEN gross_amount ELSE (SELECT CASE WHEN discount > 0 THEN (price * (1 - discount / 100)) ELSE price END FROM membership_plans WHERE membership_plans.id = subscriptions.plan_id) END) as total')
            ->value('total') ?? 0;

        $walkInRevenue = \App\Models\WalkInLog::sum('amount') ?? 0;
        $totalRevenue = $subRevenue + $walkInRevenue;

        // Recent bookings
        $recentBookings = Booking::with(['user', 'trainer'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_members' => $totalMembers,
                'pending_bookings' => $pendingBookings,
                'approved_bookings' => $approvedBookings,
                'total_trainers' => $totalTrainers,
                'total_revenue' => (float)$totalRevenue,
                'membership_revenue' => (float)$subRevenue,
                'walk_in_revenue' => (float)$walkInRevenue,
            ],
            'recent_bookings' => $recentBookings
        ]);
    }

    public function getEmployees(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $employees = Trainer::with(['user:id,email,trainer_id'])->get();
        return response()->json($employees);
    }

    public function getBookings(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $bookings = Booking::with(['user', 'trainer'])
            ->orderBy('booking_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    public function updateBookingStatus(Request $request, $id): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,cancelled,pending'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found'], 404);
        }

        $booking->status = $request->status;
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated successfully!',
            'booking' => $booking->load(['user', 'trainer'])
        ]);
    }

    // Trainer CRUD
    public function storeTrainer(Request $request): JsonResponse
    {
        $user = $this->verifyAdmin($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        if ($user->role !== 'owner') {
            return response()->json(['success' => false, 'message' => 'Akses ditolak. Hanya owner yang dapat menginput karyawan baru.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|in:trainer,kasir,admin,other',
            'specialization' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'rating' => 'nullable|string',
            'reviews' => 'nullable|string',
            'tags' => 'nullable|array',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $trainer = Trainer::create([
            'name' => $request->name,
            'role' => $request->role ?? 'trainer',
            'specialization' => $request->specialization,
            'description' => $request->description,
            'image' => $request->image ?? 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
            'rating' => $request->rating ?? '5.0',
            'reviews' => $request->reviews ?? '0',
            'tags' => $request->tags
        ]);

        if ($trainer->role === 'trainer') {
            $email = $request->email;
            if (!$email) {
                $email = strtolower(str_replace(' ', '', $request->name)) . '@predatorgym.com';
                $baseEmail = strtolower(str_replace(' ', '', $request->name));
                $counter = 1;
                while (User::where('email', $email)->exists()) {
                    $email = $baseEmail . $counter . '@predatorgym.com';
                    $counter++;
                }
            }
            $password = $request->password ? Hash::make($request->password) : Hash::make('password');

            User::create([
                'name' => $request->name,
                'email' => $email,
                'password' => $password,
                'role' => 'trainer',
                'trainer_id' => $trainer->id
            ]);
        }

        \Illuminate\Support\Facades\Cache::forget('public_trainers');

        return response()->json([
            'success' => true,
            'message' => 'Karyawan berhasil dibuat!',
            'trainer' => $trainer->load('user:id,email,trainer_id')
        ], 201);
    }

    public function updateTrainer(Request $request, $id): JsonResponse
    {
        $user = $this->verifyAdmin($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        if ($user->role !== 'owner') {
            return response()->json(['success' => false, 'message' => 'Akses ditolak. Hanya owner yang dapat memperbarui data karyawan.'], 403);
        }

        $trainer = Trainer::find($id);
        if (!$trainer) {
            return response()->json(['success' => false, 'message' => 'Karyawan tidak ditemukan'], 404);
        }

        $associatedUser = User::where('trainer_id', $trainer->id)->first();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|in:trainer,kasir,admin,other',
            'specialization' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'rating' => 'nullable|string',
            'reviews' => 'nullable|string',
            'tags' => 'nullable|array',
            'email' => 'nullable|email|unique:users,email,' . ($associatedUser ? $associatedUser->id : 'NULL'),
            'password' => 'nullable|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $trainer->update([
            'name' => $request->name,
            'role' => $request->role ?? 'trainer',
            'specialization' => $request->specialization,
            'description' => $request->description,
            'image' => $request->image ?? $trainer->image,
            'rating' => $request->rating ?? $trainer->rating,
            'reviews' => $request->reviews ?? $trainer->reviews,
            'tags' => $request->tags
        ]);

        if ($trainer->role === 'trainer') {
            if ($associatedUser) {
                $userData = [
                    'name' => $request->name
                ];
                if ($request->email) {
                    $userData['email'] = $request->email;
                }
                if ($request->password) {
                    $userData['password'] = Hash::make($request->password);
                }
                $associatedUser->update($userData);
            } else {
                $email = $request->email;
                if (!$email) {
                    $email = strtolower(str_replace(' ', '', $request->name)) . '@predatorgym.com';
                    $baseEmail = strtolower(str_replace(' ', '', $request->name));
                    $counter = 1;
                    while (User::where('email', $email)->exists()) {
                        $email = $baseEmail . $counter . '@predatorgym.com';
                        $counter++;
                    }
                }
                $password = $request->password ? Hash::make($request->password) : Hash::make('password');
                User::create([
                    'name' => $request->name,
                    'email' => $email,
                    'password' => $password,
                    'role' => 'trainer',
                    'trainer_id' => $trainer->id
                ]);
            }
        } else {
            if ($associatedUser) {
                $associatedUser->delete();
            }
        }

        \Illuminate\Support\Facades\Cache::forget('public_trainers');

        return response()->json([
            'success' => true,
            'message' => 'Karyawan berhasil diperbarui!',
            'trainer' => $trainer->load('user:id,email,trainer_id')
        ]);
    }

    public function destroyTrainer(Request $request, $id): JsonResponse
    {
        $user = $this->verifyAdmin($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        if ($user->role !== 'owner') {
            return response()->json(['success' => false, 'message' => 'Akses ditolak. Hanya owner yang dapat menghapus karyawan.'], 403);
        }

        $trainer = Trainer::find($id);
        if (!$trainer) {
            return response()->json(['success' => false, 'message' => 'Trainer not found'], 404);
        }

        $associatedUser = User::where('trainer_id', $trainer->id)->first();
        if ($associatedUser) {
            $associatedUser->delete();
        }

        $trainer->delete();

        \Illuminate\Support\Facades\Cache::forget('public_trainers');

        return response()->json([
            'success' => true,
            'message' => 'Trainer successfully deleted!'
        ]);
    }

    public function getMembers(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $members = User::where('role', 'member')
            ->with(['subscriptions' => function($q) {
                $q->with('plan')->orderBy('created_at', 'desc');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'members' => $members
        ]);
    }

    public function getSubscriptions(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $subscriptions = Subscription::with(['user', 'plan', 'trainer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'subscriptions' => $subscriptions
        ]);
    }

    public function updateSubscriptionStatus(Request $request, $id): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,pending,expired,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $subscription = Subscription::find($id);
        if (!$subscription) {
            return response()->json(['success' => false, 'message' => 'Subscription not found'], 404);
        }

        if ($request->status === 'active' && $subscription->status !== 'active') {
            if ($subscription->trainer_end_date) {
                $user = \App\Models\User::find($subscription->user_id);
                if ($user) {
                    $currentPtEnd = $user->trainer_subscription_end_date ? \Carbon\Carbon::parse($user->trainer_subscription_end_date) : now();
                    if ($currentPtEnd->isPast()) $currentPtEnd = now();
                    $addedMonths = \Carbon\Carbon::parse($subscription->start_date ?? now())->diffInMonths(\Carbon\Carbon::parse($subscription->trainer_end_date));
                    if ($addedMonths == 0) $addedMonths = 1; // fallback
                    $user->update(['trainer_subscription_end_date' => $currentPtEnd->addMonths($addedMonths)]);
                }
            }
        }

        $subscription->status = $request->status;
        $subscription->save();

        return response()->json([
            'success' => true,
            'message' => 'Status transaksi berhasil diperbarui!',
            'subscription' => $subscription->load(['user', 'plan', 'trainer'])
        ]);
    }

    public function getMembershipPlans(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $plans = MembershipPlan::orderBy('duration_months', 'asc')->get();

        return response()->json([
            'success' => true,
            'plans' => $plans
        ]);
    }

    public function getMembershipPlansPublic(): JsonResponse
    {
        $plans = \Illuminate\Support\Facades\Cache::remember('public_membership_plans', 86400, function () {
            return MembershipPlan::orderBy('duration_months', 'asc')->get();
        });

        return response()->json([
            'success' => true,
            'plans' => $plans
        ]);
    }

    public function storeMembershipPlan(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $plan = MembershipPlan::create([
            'name' => $request->name,
            'duration_months' => $request->duration_months,
            'price' => $request->price,
            'discount' => $request->discount ?? 0,
            'description' => $request->description
        ]);

        \Illuminate\Support\Facades\Cache::forget('public_membership_plans');

        return response()->json([
            'success' => true,
            'message' => 'Paket membership berhasil ditambahkan!',
            'plan' => $plan
        ], 201);
    }

    public function updateMembershipPlan(Request $request, $id): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $plan = MembershipPlan::find($id);
        if (!$plan) {
            return response()->json(['success' => false, 'message' => 'Paket membership tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $plan->update([
            'name' => $request->name,
            'duration_months' => $request->duration_months,
            'price' => $request->price,
            'discount' => $request->discount ?? 0,
            'description' => $request->description
        ]);

        \Illuminate\Support\Facades\Cache::forget('public_membership_plans');

        return response()->json([
            'success' => true,
            'message' => 'Paket membership berhasil diperbarui!',
            'plan' => $plan
        ]);
    }

    public function destroyMembershipPlan(Request $request, $id): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $plan = MembershipPlan::find($id);
        if (!$plan) {
            return response()->json(['success' => false, 'message' => 'Paket membership tidak ditemukan'], 404);
        }

        // Check if there are active subscriptions using this plan
        $activeCount = Subscription::where('plan_id', $id)->where('status', 'active')->count();
        if ($activeCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus paket membership karena masih digunakan oleh member aktif.'
            ], 400);
        }

        $plan->delete();

        \Illuminate\Support\Facades\Cache::forget('public_membership_plans');

        return response()->json([
            'success' => true,
            'message' => 'Paket membership berhasil dihapus!'
        ]);
    }

    public function getWalkInLogs(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $logs = \App\Models\WalkInLog::orderBy('visit_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'logs' => $logs
        ]);
    }

    public function storeWalkInLog(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'whatsapp' => 'nullable|string|max:50',
            'amount' => 'nullable|numeric|min:0',
            'visit_date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $log = \App\Models\WalkInLog::create([
            'name' => $request->name,
            'whatsapp' => $request->whatsapp,
            'amount' => $request->amount ?? 15000,
            'visit_date' => $request->visit_date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kunjungan Harian berhasil dicatat!',
            'log' => $log
        ], 201);
    }

    public function destroyWalkInLog(Request $request, $id): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $log = \App\Models\WalkInLog::find($id);
        if (!$log) {
            return response()->json(['success' => false, 'message' => 'Log kunjungan tidak ditemukan'], 404);
        }

        $log->delete();

        return response()->json([
            'success' => true,
            'message' => 'Log kunjungan berhasil dihapus!'
        ]);
    }
}
