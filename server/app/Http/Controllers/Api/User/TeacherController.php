<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;

class TeacherController extends Controller
{
    public function index(): JsonResponse
    {
        $teachers = Teacher::with('user')->get();

        return response()->json(['data' => $teachers]);
    }

    public function store(CreateTeacherRequest $request): JsonResponse
    {
        $teacher = Teacher::create($request->validated());

        return response()->json([
            'message' => 'Thêm giáo viên thành công.',
            'data' => $teacher,
        ], 201);
    }

    public function show(string $code): JsonResponse
    {
        $teacher = Teacher::with('user')->find($code);

        if (!$teacher) {
            return response()->json(['message' => 'Không tìm thấy giáo viên.'], 404);
        }

        return response()->json(['data' => $teacher]);
    }

    public function update(UpdateTeacherRequest $request, string $code): JsonResponse
    {
        $teacher = Teacher::find($code);

        if (!$teacher) {
            return response()->json(['message' => 'Không tìm thấy giáo viên.'], 404);
        }

        $teacher->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật giáo viên thành công.',
            'data' => $teacher,
        ]);
    }

    public function destroy(string $code): JsonResponse
    {
        $teacher = Teacher::find($code);

        if (!$teacher) {
            return response()->json(['message' => 'Không tìm thấy giáo viên.'], 404);
        }

        $teacher->delete();

        return response()->json(['message' => 'Xóa giáo viên thành công.']);
    }
}
