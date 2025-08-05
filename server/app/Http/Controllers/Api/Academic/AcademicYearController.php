<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Models\AcademicYear;
use Illuminate\Http\JsonResponse;

class AcademicYearController extends Controller
{
    public function index(): JsonResponse
    {
        $years = AcademicYear::orderBy('start_year', 'desc')->get();
        return response()->json(['data' => $years]);
    }

    public function getAcademicYearsWithSemesters(): JsonResponse
    {
        $years = AcademicYear::whereHas('semesters')->get();
        return response()->json(['data' => $years]);
    }


    public function store(CreateAcademicYearRequest $request): JsonResponse
    {
        $year = AcademicYear::create($request->validated());
        return response()->json([
            'message' => 'Tạo năm học thành công.',
            'data' => $year,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $year = AcademicYear::find($id);
        if (!$year) {
            return response()->json(['message' => 'Không tìm thấy năm học.'], 404);
        }
        return response()->json(['data' => $year]);
    }

    public function update(UpdateAcademicYearRequest $request, $id): JsonResponse
    {
        $year = AcademicYear::find($id);
        if (!$year) {
            return response()->json(['message' => 'Không tìm thấy năm học.'], 404);
        }

        $year->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật năm học thành công.',
            'data' => $year,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $year = AcademicYear::find($id);
        if (!$year) {
            return response()->json(['message' => 'Không tìm thấy năm học.'], 404);
        }

        $year->delete();

        return response()->json(['message' => 'Xóa năm học thành công.']);
    }
}
