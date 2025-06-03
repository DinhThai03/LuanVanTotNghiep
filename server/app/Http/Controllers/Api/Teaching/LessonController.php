<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateLessonRequest;
use App\Http\Requests\LessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;

class LessonController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Lesson::with('teacherSubject')->get()]);
    }

    public function store(CreateLessonRequest $request): JsonResponse
    {
        $lesson = Lesson::create($request->validated());

        return response()->json([
            'message' => 'Tạo lịch học thành công.',
            'data' => $lesson,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $lesson = Lesson::with(['teacherSubject', 'lessonRooms'])->find($id);
        if (!$lesson) {
            return response()->json(['message' => 'Không tìm thấy lịch học.'], 404);
        }

        return response()->json(['data' => $lesson]);
    }

    public function update(UpdateLessonRequest $request, $id): JsonResponse
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['message' => 'Không tìm thấy lịch học.'], 404);
        }

        $lesson->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật lịch học thành công.',
            'data' => $lesson,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['message' => 'Không tìm thấy lịch học.'], 404);
        }

        $lesson->delete();

        return response()->json(['message' => 'Xóa lịch học thành công.']);
    }
}
