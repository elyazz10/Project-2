<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(7);

// Mock the getAuthUser by overriding the method or just calling logic directly
$isFirstTimeMember = \Illuminate\Support\Facades\Cache::remember('is_first_time_member_' . $user->id, 60, function () use ($user) {
    return !\App\Models\Subscription::where('user_id', $user->id)
        ->whereIn('status', ['active', 'expired'])
        ->exists();
});

echo "Direct eval: " . ($isFirstTimeMember ? "true" : "false") . "\n";
