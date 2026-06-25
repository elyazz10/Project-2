<?php

namespace App\Http\Controllers;

use App\Models\GymFeature;
use App\Models\User;
use App\Helpers\JWTHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class GymFeatureController extends Controller
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

    public function index(): JsonResponse
    {
        $features = GymFeature::all();
        return response()->json([
            'success' => true,
            'features' => $features
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:facility,equipment',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $feature = GymFeature::create([
            'name' => $request->name,
            'description' => $request->description,
            'icon' => $request->icon ?? 'Dumbbell',
            'type' => $request->type,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil ditambahkan!',
            'feature' => $feature
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $feature = GymFeature::find($id);
        if (!$feature) {
            return response()->json(['success' => false, 'message' => 'Item tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:facility,equipment',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $feature->update([
            'name' => $request->name,
            'description' => $request->description,
            'icon' => $request->icon ?? 'Dumbbell',
            'type' => $request->type,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil diperbarui!',
            'feature' => $feature
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        if (!$this->verifyAdmin($request)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $feature = GymFeature::find($id);
        if (!$feature) {
            return response()->json(['success' => false, 'message' => 'Item tidak ditemukan'], 404);
        }

        $feature->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil dihapus!'
        ]);
    }
}
