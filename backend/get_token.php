<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(7);

// Create token manually since trait is missing
$token = $user->tokens()->create([
    'name' => 'test',
    'token' => hash('sha256', $plainTextToken = \Illuminate\Support\Str::random(40)),
    'abilities' => ['*'],
]);

echo $token->id.'|'.$plainTextToken;
