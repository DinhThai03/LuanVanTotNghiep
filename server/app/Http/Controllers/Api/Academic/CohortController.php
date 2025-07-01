<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller as ApiController;
use App\Models\Cohort;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CohortController extends ApiController
{
    // Lấy danh sách tất cả cohort
    public function index(): JsonResponse
    {
        $cohorts = Cohort::orderBy('start_year', 'desc')->get();
        return response()->json($cohorts);
    }

    // Tạo mới cohort
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'       => 'required|string|unique:cohorts,name',
            'start_year' => 'required|integer|min:2000|max:2100',
            'end_year'   => 'required|integer|gte:start_year|max:2100',
        ]);

        $cohort = Cohort::create($validated);
        return response()->json($cohort, 201);
    }

    // Lấy chi tiết 1 cohort
    public function show($id): JsonResponse
    {
        $cohort = Cohort::with(['classes', 'students'])->findOrFail($id);
        return response()->json($cohort);
    }

    // Cập nhật cohort
    public function update(Request $request, $id): JsonResponse
    {
        $cohort = Cohort::findOrFail($id);

        $validated = $request->validate([
            'name'       => 'sometimes|string|unique:cohorts,name,' . $id,
            'start_year' => 'sometimes|integer|min:2000|max:2100',
            'end_year'   => 'sometimes|integer|gte:start_year|max:2100',
        ]);

        $cohort->update($validated);
        return response()->json($cohort);
    }

    // Xóa cohort
    public function destroy($id): JsonResponse
    {
        $cohort = Cohort::findOrFail($id);
        $cohort->delete();

        return response()->json(['message' => 'Xóa thành công']);
    }

    // Lọc theo năm bắt đầu
    public function byYear($year): JsonResponse
    {
        $cohorts = Cohort::where('start_year', $year)->get();
        return response()->json($cohorts);
    }

    // Lấy danh sách lớp thuộc cohort
    public function classes($id): JsonResponse
    {
        $cohort = Cohort::with('classes')->findOrFail($id);
        return response()->json($cohort->classes);
    }

    // Lấy danh sách sinh viên thuộc cohort (qua lớp)
    public function students($id): JsonResponse
    {
        $cohort = Cohort::with('students')->findOrFail($id);
        return response()->json($cohort->students);
    }
}
