<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;

class SubjectController extends Controller
{
    public function index(): JsonResponse
    {
        $subjects = Subject::all();
        return response()->json(['data' => $subjects]);
    }

    public function store(CreateSubjectRequest $request): JsonResponse
    {
        $subject = Subject::create($request->validated());

        return response()->json([
            'message' => 'Tạo môn học thành công.',
            'data' => $subject,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $subject = Subject::find($id);
        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học.'], 404);
        }

        return response()->json(['data' => $subject]);
    }

    public function update(UpdateSubjectRequest $request, $id): JsonResponse
    {
        $subject = Subject::find($id);
        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học.'], 404);
        }

        $subject->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật môn học thành công.',
            'data' => $subject,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $subject = Subject::find($id);
        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học.'], 404);
        }

        $subject->delete();

        return response()->json(['message' => 'Xóa môn học thành công.']);
    }
}
