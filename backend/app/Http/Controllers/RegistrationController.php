<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'tanggal_lahir' => 'required|date',
            'tujuan' => 'required|string|max:255',
            'pelatih' => 'nullable|string|max:255',
            'paket' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $registration = Registration::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Registration successfully created!',
            'data' => $registration
        ], 201);
    }
}
