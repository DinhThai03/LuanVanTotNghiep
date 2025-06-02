<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateSchoolClassRequest;
use App\Http\Requests\UpdateSchoolClassRequest;
use App\Models\SchoolClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index(): JsonResponse
    {
        $classes = SchoolClass::with('faculty')->get();
        return response()->json(['data' => $classes]);
    }

    public function store(CreateSchoolClassRequest $request): JsonResponse
    {
        $class = SchoolClass::create($request->validated());
        return response()->json([
            'message' => 'Tạo lớp học thành công.',
            'data' => $class,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $class = SchoolClass::with('faculty')->find($id);
        if (!$class) {
            return response()->json(['message' => 'Không tìm thấy lớp học.'], 404);
        }
        return response()->json(['data' => $class]);
    }

    public function update(UpdateSchoolClassRequest $request, $id): JsonResponse
    {
        $class = SchoolClass::find($id);
        if (!$class) {
            return response()->json(['message' => 'Không tìm thấy lớp học.'], 404);
        }

        $class->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật lớp học thành công.',
            'data' => $class,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $class = SchoolClass::find($id);
        if (!$class) {
            return response()->json(['message' => 'Không tìm thấy lớp học.'], 404);
        }

        $class->delete();

        return response()->json(['message' => 'Xóa lớp học thành công.']);
    }
}
