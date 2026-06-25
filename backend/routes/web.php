<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Predator Gym Backend API',
        'status' => 'online',
        'version' => '1.0.0'
    ]);
});
