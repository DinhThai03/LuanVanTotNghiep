<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\SemesterSubjectRequest;
use App\Models\SemesterSubject;
use Illuminate\Http\JsonResponse;

class SemesterSubjectController extends Controller
{
    public function index(): JsonResponse
    {
        $data = SemesterSubject::with(['subject', 'semester'])->get();
        return response()->json(['data' => $data]);
    }

    public function store(SemesterSubjectRequest $request): JsonResponse
    {
        $semesterSubject = SemesterSubject::create($request->validated());

        return response()->json([
            'message' => 'Thêm môn học cho học kỳ thành công.',
            'data' => $semesterSubject,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $semesterSubject = SemesterSubject::with(['subject', 'semester'])->find($id);
        if (!$semesterSubject) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        return response()->json(['data' => $semesterSubject]);
    }

    public function update(SemesterSubjectRequest $request, $id): JsonResponse
    {
        $semesterSubject = SemesterSubject::find($id);
        if (!$semesterSubject) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $semesterSubject->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thành công.',
            'data' => $semesterSubject,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $semesterSubject = SemesterSubject::find($id);
        if (!$semesterSubject) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $semesterSubject->delete();

        return response()->json(['message' => 'Xóa thành công.']);
    }
}
