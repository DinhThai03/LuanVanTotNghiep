<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Danh sách tất cả sinh viên.
     */
    public function index(): JsonResponse
    {
        $students = Student::with(['user', 'schoolClass'])->get(); // class => quan hệ với school_classes
        return response()->json($students);
    }

    /**
     * Tạo sinh viên mới.
     */
    public function store(CreateStudentRequest $request): JsonResponse
    {
        $student = Student::create($request->validated());

        return response()->json([
            'message' => 'Tạo sinh viên thành công.',
            'data' => $student,
        ], 201);
    }

    /**
     * Lấy thông tin một sinh viên theo mã.
     */
    public function show(string $code): JsonResponse
    {
        $student = Student::with(['user', 'schoolClass'])->find($code);

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
        }

        return response()->json($student);
    }

    /**
     * Cập nhật thông tin sinh viên.
     */
    public function update(UpdateStudentRequest $request, string $code): JsonResponse
    {
        $student = Student::find($code);

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
        }

        $student->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật sinh viên thành công.',
            'data' => $student,
        ]);
    }

    /**
     * Xoá một sinh viên.
     */
    public function destroy(string $code): JsonResponse
    {
        $student = Student::find($code);

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
        }

        $student->delete();

        return response()->json(['message' => 'Xoá sinh viên thành công.']);
    }
}
