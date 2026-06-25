<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use App\Models\Trainer;
use App\Helpers\JWTHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TrainerDashboardController extends Controller
{
    private function verifyTrainer(Request $request): ?User
    {
        $token = $request->bearerToken();
        if (!$token) return null;
        try {
            $payload = JWTHelper::decode($token);
            if (!$payload || !isset($payload['sub']) || $payload['role'] !== 'trainer') {
                return null;
            }
            return User::find($payload['sub']);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getDashboard(Request $request): JsonResponse
    {
        $user = $this->verifyTrainer($request);
        if (!$user || !$user->trainer_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized or trainer profile not linked'], 401);
        }

        $trainerId = $user->trainer_id;

        // Calculate stats
        $pendingBookings = Booking::where('trainer_id', $trainerId)->where('status', 'pending')->count();
        $approvedBookings = Booking::where('trainer_id', $trainerId)->where('status', 'approved')->count();
        $completedBookings = Booking::where('trainer_id', $trainerId)->where('status', 'completed')->count();

        // Get unique members who booked with this trainer
        $memberIds = Booking::where('trainer_id', $trainerId)->pluck('user_id')->unique()->toArray();
        $totalMembers = User::whereIn('id', $memberIds)->count();

        // Bookings list
        $bookings = Booking::with('user')
            ->where('trainer_id', $trainerId)
            ->orderBy('booking_date', 'desc')
            ->orderBy('booking_time', 'desc')
            ->get();

        // Members list details
        $members = User::whereIn('id', $memberIds)
            ->orWhere('trainer_id', $trainerId)
            ->select('id', 'name', 'email', 'whatsapp', 'trainer_subscription_end_date')
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_members' => $totalMembers,
                'pending_bookings' => $pendingBookings,
                'approved_bookings' => $approvedBookings,
                'completed_bookings' => $completedBookings,
            ],
            'bookings' => $bookings,
            'members' => $members
        ]);
    }

    public function updateBookingStatus(Request $request, $id): JsonResponse
    {
        $user = $this->verifyTrainer($request);
        if (!$user || !$user->trainer_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:approved,cancelled,completed',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $booking = Booking::where('id', $id)->where('trainer_id', $user->trainer_id)->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found'], 404);
        }

        $oldStatus = $booking->status;
        $newStatus = $request->status;

        $booking->status = $newStatus;
        if ($request->has('notes')) {
            $booking->notes = $request->notes;
        }
        $booking->save();

        // If booking is changed to cancelled from approved or pending, refund the session token to the user
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled' && $oldStatus !== 'completed') {
            $member = User::find($booking->user_id);
            if ($member) {
                // $member->increment('trainer_sessions'); // No longer needed
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated successfully!',
            'booking' => $booking->load('user')
        ]);
    }
}
