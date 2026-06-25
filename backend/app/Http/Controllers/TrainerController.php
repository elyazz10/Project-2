<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use Illuminate\Http\JsonResponse;

class TrainerController extends Controller
{
    public function index(): JsonResponse
    {
        // Public endpoint only returns actual trainers
        $trainers = \Illuminate\Support\Facades\Cache::remember('public_trainers', 86400, function () {
            return Trainer::where('role', 'trainer')->get();
        });
        return response()->json($trainers);
    }
}
