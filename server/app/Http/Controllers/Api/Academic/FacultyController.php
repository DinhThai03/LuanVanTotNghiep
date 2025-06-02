<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\FacultyRequest;
use App\Models\Faculty;
use Illuminate\Http\JsonResponse;

class FacultyController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Faculty::all()]);
    }

    public function store(FacultyRequest $request): JsonResponse
    {
        $faculty = Faculty::create($request->validated());

        return response()->json([
            'message' => 'Tạo khoa thành công.',
            'data' => $faculty,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $faculty = Faculty::find($id);
        if (!$faculty) {
            return response()->json(['message' => 'Không tìm thấy khoa.'], 404);
        }

        return response()->json(['data' => $faculty]);
    }

    public function update(FacultyRequest $request, $id): JsonResponse
    {
        $faculty = Faculty::find($id);
        if (!$faculty) {
            return response()->json(['message' => 'Không tìm thấy khoa.'], 404);
        }

        $faculty->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật khoa thành công.',
            'data' => $faculty,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $faculty = Faculty::find($id);
        if (!$faculty) {
            return response()->json(['message' => 'Không tìm thấy khoa.'], 404);
        }

        $faculty->delete();

        return response()->json(['message' => 'Xóa khoa thành công.']);
    }
}
