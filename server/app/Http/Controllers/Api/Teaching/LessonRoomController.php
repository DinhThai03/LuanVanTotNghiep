<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateLessonRoomRequest;
use App\Http\Requests\LessonRoomRequest;
use App\Http\Requests\UpdateLessonRoomRequest;
use App\Models\LessonRoom;
use Illuminate\Http\JsonResponse;

class LessonRoomController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => LessonRoom::with(['lesson', 'room'])->get()]);
    }

    public function store(CreateLessonRoomRequest $request): JsonResponse
    {
        $lessonRoom = LessonRoom::create($request->validated());

        return response()->json([
            'message' => 'Phân phòng cho buổi học thành công.',
            'data' => $lessonRoom,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $lessonRoom = LessonRoom::with(['lesson', 'room'])->find($id);
        if (!$lessonRoom) {
            return response()->json(['message' => 'Không tìm thấy thông tin phân phòng.'], 404);
        }

        return response()->json(['data' => $lessonRoom]);
    }

    public function update(UpdateLessonRoomRequest $request, $id): JsonResponse
    {
        $lessonRoom = LessonRoom::find($id);
        if (!$lessonRoom) {
            return response()->json(['message' => 'Không tìm thấy thông tin phân phòng.'], 404);
        }

        $lessonRoom->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật phân phòng thành công.',
            'data' => $lessonRoom,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $lessonRoom = LessonRoom::find($id);
        if (!$lessonRoom) {
            return response()->json(['message' => 'Không tìm thấy thông tin phân phòng.'], 404);
        }

        $lessonRoom->delete();

        return response()->json(['message' => 'Xóa phân phòng thành công.']);
    }
}
