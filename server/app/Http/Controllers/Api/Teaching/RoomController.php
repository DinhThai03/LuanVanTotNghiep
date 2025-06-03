<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateRoomRequest;
use App\Http\Requests\RoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Room::all()]);
    }

    public function store(CreateRoomRequest $request): JsonResponse
    {
        $room = Room::create($request->validated());

        return response()->json([
            'message' => 'Tạo phòng học thành công.',
            'data' => $room,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng học.'], 404);
        }

        return response()->json(['data' => $room]);
    }

    public function update(UpdateRoomRequest $request, $id): JsonResponse
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng học.'], 404);
        }

        $room->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật phòng học thành công.',
            'data' => $room,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng học.'], 404);
        }

        $room->delete();
        return response()->json(['message' => 'Xóa phòng học thành công.']);
    }
}
