<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(7);
$subs = \App\Models\Subscription::where('user_id', $user->id)->get();

echo "User ID: " . $user->id . "\n";
echo "Subscriptions: " . json_encode($subs) . "\n";
$isFirstTime = !\App\Models\Subscription::where('user_id', $user->id)
                ->whereIn('status', ['active', 'expired'])
                ->exists();
echo "isFirstTime: " . ($isFirstTime ? 'true' : 'false') . "\n";
