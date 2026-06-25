<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GymFeatureController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PtPackageController;

// Public APIs
Route::get('/trainers', [TrainerController::class, 'index']);
Route::post('/registrations', [RegistrationController::class, 'store']);
Route::get('/membership-plans', [AdminController::class, 'getMembershipPlansPublic']);
Route::get('/gym-features', [GymFeatureController::class, 'index']);
Route::get('/pt-packages', [PtPackageController::class, 'index']);
Route::post('/midtrans/webhook', [MemberController::class, 'handleNotification']);

// Auth APIs
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Member Dashboard APIs
Route::prefix('member')->group(function () {
    Route::get('/checkout-data', [MemberController::class, 'checkoutData']);
    Route::get('/dashboard', [MemberController::class, 'dashboard']);
    Route::get('/subscriptions', [MemberController::class, 'subscriptions']);
    Route::post('/bookings', [MemberController::class, 'bookTrainer']);
    Route::put('/bookings/{id}/cancel', [MemberController::class, 'cancelBooking']);
    Route::post('/bmi', [MemberController::class, 'logBmi']);
    Route::post('/subscribe', [MemberController::class, 'subscribe']);
    Route::post('/subscribe/verify', [MemberController::class, 'verifyPayment']);
    Route::put('/profile', [MemberController::class, 'updateProfile']);
    
    Route::get('/chats', [ChatController::class, 'getMemberMessages']);
    Route::post('/chats', [ChatController::class, 'sendMemberMessage']);
});

// Trainer Dashboard APIs
Route::prefix('trainer')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\TrainerDashboardController::class, 'getDashboard']);
    Route::put('/bookings/{id}', [\App\Http\Controllers\TrainerDashboardController::class, 'updateBookingStatus']);
});

// Admin Dashboard APIs
Route::prefix('admin')->group(function () {
    Route::get('/dashboard-stats', [AdminController::class, 'dashboardStats']);
    Route::get('/bookings', [AdminController::class, 'getBookings']);
    Route::put('/bookings/{id}', [AdminController::class, 'updateBookingStatus']);
    Route::get('/trainers', [AdminController::class, 'getEmployees']); // Note: Keeping the route name as /trainers for admin, but using getEmployees method.
    Route::post('/trainers', [AdminController::class, 'storeTrainer']);
    Route::put('/trainers/{id}', [AdminController::class, 'updateTrainer']);
    Route::delete('/trainers/{id}', [AdminController::class, 'destroyTrainer']);
    Route::get('/members', [AdminController::class, 'getMembers']);
    Route::get('/subscriptions', [AdminController::class, 'getSubscriptions']);
    Route::put('/subscriptions/{id}', [AdminController::class, 'updateSubscriptionStatus']);
    
    // Membership Plan CRUD
    Route::get('/membership-plans', [AdminController::class, 'getMembershipPlans']);
    Route::post('/membership-plans', [AdminController::class, 'storeMembershipPlan']);
    Route::put('/membership-plans/{id}', [AdminController::class, 'updateMembershipPlan']);
    Route::delete('/membership-plans/{id}', [AdminController::class, 'destroyMembershipPlan']);

    // Gym Facilities & Equipment CRUD
    Route::post('/gym-features', [GymFeatureController::class, 'store']);
    Route::put('/gym-features/{id}', [GymFeatureController::class, 'update']);
    Route::delete('/gym-features/{id}', [GymFeatureController::class, 'destroy']);

    // PT Packages CRUD
    Route::get('/pt-packages', [PtPackageController::class, 'adminIndex']);
    Route::post('/pt-packages', [PtPackageController::class, 'store']);
    Route::put('/pt-packages/{id}', [PtPackageController::class, 'update']);
    Route::delete('/pt-packages/{id}', [PtPackageController::class, 'destroy']);

    // Walk-In Log APIs
    Route::get('/walk-in-logs', [AdminController::class, 'getWalkInLogs']);
    Route::post('/walk-in-logs', [AdminController::class, 'storeWalkInLog']);
    Route::delete('/walk-in-logs/{id}', [AdminController::class, 'destroyWalkInLog']);

    // Chat APIs
    Route::get('/chats', [ChatController::class, 'getAdminConversations']);
    Route::get('/chats/{userId}', [ChatController::class, 'getAdminMessages']);
    Route::post('/chats/{userId}', [ChatController::class, 'sendAdminMessage']);
});
