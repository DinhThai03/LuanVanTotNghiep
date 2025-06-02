<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;
use App\Models\Semester;
use Illuminate\Http\JsonResponse;

class SemesterController extends Controller
{
    public function index(): JsonResponse
    {
        $semesters = Semester::with('academicYear')->get();
        return response()->json(['data' => $semesters]);
    }

    public function store(CreateSemesterRequest $request): JsonResponse
    {
        $semester = Semester::create($request->validated());
        return response()->json([
            'message' => 'Tạo học kỳ thành công.',
            'data' => $semester,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $semester = Semester::with('academicYear')->find($id);
        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ.'], 404);
        }
        return response()->json(['data' => $semester]);
    }

    public function update(UpdateSemesterRequest $request, $id): JsonResponse
    {
        $semester = Semester::find($id);
        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ.'], 404);
        }

        $semester->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật học kỳ thành công.',
            'data' => $semester,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $semester = Semester::find($id);
        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ.'], 404);
        }

        $semester->delete();

        return response()->json(['message' => 'Xóa học kỳ thành công.']);
    }
}
