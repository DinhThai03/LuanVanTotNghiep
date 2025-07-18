<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;
use App\Models\Semester;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PHPUnit\Event\TestSuite\Loaded;

class SemesterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Semester::with('academicYear');
        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->get('academic_year_id'));
        }

        $semesters = $query->orderBy('id', 'desc')->get();
        return response()->json(['data' => $semesters]);
    }
    
    //lấy các học kì mà sinh viên đó học
    public function getSemestersByStudent(string $userId): JsonResponse
    {
        $student = Student::with('schoolClass.cohort')->where('user_id', $userId)->first();

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
        }

        if (!$student->schoolClass) {
            return response()->json(['message' => 'Sinh viên chưa được phân vào lớp học.'], 404);
        }

        $cohort = $student->schoolClass->cohort;

        if (!$cohort) {
            return response()->json(['message' => 'Không tìm thấy niên khóa (cohort) của lớp học.'], 404);
        }

        // Lấy danh sách academic year trong khoảng niên khóa
        $academicYearIds = \App\Models\AcademicYear::whereBetween('start_year', [$cohort->start_year, $cohort->end_year])
            ->pluck('id');

        if ($academicYearIds->isEmpty()) {
            return response()->json(['message' => 'Không có niên khóa nào khớp với cohort.'], 404);
        }

        $semesters = \App\Models\Semester::with('academicYear')
            ->whereIn('academic_year_id', $academicYearIds)
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json([
            'data' => $semesters,
        ]);
    }


    public function store(CreateSemesterRequest $request): JsonResponse
    {
        $semester = Semester::create($request->validated());
        $semester->Load('academicYear');
        return response()->json([
            'message' => 'Tạo học kỳ thành công.',
            'data' => $semester,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $semester = Semester::with('academicYear')->find($id);
        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ.'], 404);
        }
        return response()->json(['data' => $semester]);
    }

    public function update(UpdateSemesterRequest $request, $id): JsonResponse
    {
        $semester = Semester::find($id);
        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ.'], 404);
        }

        $semester->update($request->validated());
        $semester->load('academicYear');
        return response()->json([
            'message' => 'Cập nhật học kỳ thành công.',
            'data' => $semester,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $semester = Semester::find($id);
        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ.'], 404);
        }

        $semester->delete();

        return response()->json(['message' => 'Xóa học kỳ thành công.']);
    }
}
