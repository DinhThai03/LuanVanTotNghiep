<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateRegistrationPeriodRequest;
use App\Http\Requests\UpdateRegistrationPeriodRequest;
use App\Models\RegistrationPeriod;
use Illuminate\Http\JsonResponse;

class RegistrationPeriodController extends Controller
{
    // Lấy danh sách tất cả
    public function index(): JsonResponse
    {
        $periods = RegistrationPeriod::with(['faculty', 'semester'])->get();
        return response()->json(['data' => $periods]);
    }

    // Tạo mới
    public function store(CreateRegistrationPeriodRequest $request): JsonResponse
    {
        $period = RegistrationPeriod::create($request->validated());

        return response()->json([
            'message' => 'Tạo thành công',
            'data' => $period
        ], 201);
    }

    public function update(UpdateRegistrationPeriodRequest $request, $id): JsonResponse
    {
        $period = RegistrationPeriod::findOrFail($id);
        $period->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $period
        ]);
    }

    // Xóa
    public function destroy($id): JsonResponse
    {
        $period = RegistrationPeriod::findOrFail($id);
        $period->delete();

        return response()->json(['message' => 'Xóa thành công']);
    }
}
