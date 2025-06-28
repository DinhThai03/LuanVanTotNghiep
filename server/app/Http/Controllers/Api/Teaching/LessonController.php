<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $query = Lesson::with([
            'teacherSubject.teacher.user',
            'teacherSubject.subject',
            'room',
        ]);

        if ($request->has('semester_id')) {
            $query->where('semester_id', $request->semester_id);
        }

        if ($request->has('faculty_id')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('teacherSubject.subject', function ($sub) use ($request) {
                    $sub->whereHas('facultySubjects', function ($inner) use ($request) {
                        $inner->where('faculty_id', $request->faculty_id);
                    });
                })->orWhereHas('teacherSubject.subject', function ($sub) {
                    $sub->doesntHave('facultySubjects');
                });
            });
        }

        return response()->json([
            'data' => $query->get()
        ]);
    }


    public function store(CreateLessonRequest $request): JsonResponse
    {
        $lesson = Lesson::create($request->validated());
        $lesson->load('teacherSubject.teacher.user', 'teacherSubject.subject', 'room');

        return response()->json([
            'message' => 'Tạo lịch học thành công.',
            'data' => $lesson,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $lesson = Lesson::with(['teacherSubject'])->find($id);
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
        $lesson->load('teacherSubject.teacher.user', 'teacherSubject.subject', 'room');
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
