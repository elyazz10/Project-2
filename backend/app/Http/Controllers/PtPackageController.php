<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\PtPackage;

class PtPackageController extends Controller
{
    public function index()
    {
        $packages = \Illuminate\Support\Facades\Cache::remember('public_pt_packages', 86400, function () {
            return PtPackage::where('is_active', true)->orderBy('duration_months', 'asc')->get();
        });
        return response()->json(['success' => true, 'packages' => $packages]);
    }

    public function adminIndex(Request $request)
    {
        // Admin gets all packages including inactive ones
        if ($request->user() && $request->user()->role !== 'owner' && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $packages = PtPackage::orderBy('duration_months', 'asc')->get();
        return response()->json(['success' => true, 'packages' => $packages]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean'
        ]);

        $package = PtPackage::create($request->all());
        \Illuminate\Support\Facades\Cache::forget('public_pt_packages');
        return response()->json(['success' => true, 'package' => $package]);
    }

    public function update(Request $request, $id)
    {
        $package = PtPackage::find($id);
        if (!$package) return response()->json(['message' => 'Not found'], 404);

        $request->validate([
            'duration_months' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean'
        ]);

        $package->update($request->all());
        \Illuminate\Support\Facades\Cache::forget('public_pt_packages');
        return response()->json(['success' => true, 'package' => $package]);
    }

    public function destroy($id)
    {
        $package = PtPackage::find($id);
        if (!$package) return response()->json(['message' => 'Not found'], 404);

        $package->delete();
        \Illuminate\Support\Facades\Cache::forget('public_pt_packages');
        return response()->json(['success' => true]);
    }
}
