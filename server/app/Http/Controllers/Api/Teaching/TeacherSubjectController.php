<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateTeacherSubjectRequest;
use App\Http\Requests\TeacherSubjectRequest;
use App\Http\Requests\UpdateTeacherSubjectRequest;
use App\Models\TeacherSubject;
use Illuminate\Http\JsonResponse;

class TeacherSubjectController extends Controller
{
    public function index(): JsonResponse
    {
        $data = TeacherSubject::with(['teacher', 'subject'])->get();
        return response()->json(['data' => $data]);
    }

    public function store(CreateTeacherSubjectRequest $request): JsonResponse
    {
        $record = TeacherSubject::create($request->validated());

        return response()->json([
            'message' => 'Gán giáo viên với môn học thành công.',
            'data' => $record,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $record = TeacherSubject::with(['teacher', 'subject'])->find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        return response()->json(['data' => $record]);
    }

    public function update(UpdateTeacherSubjectRequest $request, $id): JsonResponse
    {
        $record = TeacherSubject::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $record->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thành công.',
            'data' => $record,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $record = TeacherSubject::find($id);
        if (!$record) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $record->delete();
        return response()->json(['message' => 'Xóa thành công.']);
    }
}
