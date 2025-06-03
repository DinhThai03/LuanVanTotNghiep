<?php

namespace App\Http\Controllers\Api\Communication;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\AnnouncementRequest;
use App\Http\Requests\CreateAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Announcement::latest('date')->get()]);
    }

    public function store(CreateAnnouncementRequest $request): JsonResponse
    {
        $announcement = Announcement::create($request->validated());

        return response()->json([
            'message' => 'Tạo thông báo thành công.',
            'data' => $announcement,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $announcement = Announcement::find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Không tìm thấy thông báo.'], 404);
        }

        return response()->json(['data' => $announcement]);
    }

    public function update(UpdateAnnouncementRequest $request, $id): JsonResponse
    {
        $announcement = Announcement::find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Không tìm thấy thông báo.'], 404);
        }

        $announcement->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thông báo thành công.',
            'data' => $announcement,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $announcement = Announcement::find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Không tìm thấy thông báo.'], 404);
        }

        $announcement->delete();

        return response()->json(['message' => 'Xóa thông báo thành công.']);
    }
}
