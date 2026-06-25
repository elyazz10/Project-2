<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'azriel@gmail.com')->first();
$isFirstTimeMember = !\App\Models\Subscription::where('user_id', $user->id)
    ->whereIn('status', ['active', 'expired'])
    ->exists();

echo "User ID: " . $user->id . "\n";
echo "isFirstTimeMember: " . ($isFirstTimeMember ? 'true' : 'false') . "\n";
