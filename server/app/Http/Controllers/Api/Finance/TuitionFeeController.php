<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateTuitionFeeRequest;
use App\Http\Requests\UpdateTuitionFeeRequest;
use App\Models\Semester;
use App\Models\TuitionFee;
use Illuminate\Http\Request;

class TuitionFeeController extends Controller
{
    public function index()
    {
        return response()->json(TuitionFee::all());
    }

    public function store(CreateTuitionFeeRequest $request)
    {
        $tuitionFee = TuitionFee::create($request->validated());

        return response()->json([
            'message' => 'Đã tạo học phí thành công.',
            'data' => $tuitionFee,
        ], 201);
    }

    public function getBySemester($studentCode, Request $request)
    {
        $semesterId = $request->query('semester_id');

        // Ưu tiên lấy học kỳ theo ID nếu có
        if ($semesterId) {
            $semester = Semester::find($semesterId);
        }

        // Nếu không có ID, tìm học kỳ hiện tại
        if (!isset($semester)) {
            $semester = Semester::where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->orderBy('start_date', 'asc')
                ->first();
        }

        // Nếu vẫn chưa có, tìm học kỳ sắp tới
        if (!$semester) {
            $semester = Semester::where('start_date', '>', now())
                ->orderBy('start_date', 'asc')
                ->first();
        }

        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ phù hợp.'], 404);
        }

        // Lấy học phí theo student_code và semester_id
        $tuitionFees = TuitionFee::whereHas('registration', function ($query) use ($studentCode, $semester) {
            $query->where('student_code', $studentCode)
                ->whereHas('lesson', function ($q) use ($semester) {
                    $q->where('semester_id', $semester->id);
                });
        })->with(['registration.lesson.teacherSubject.subject'])
            ->get();

        return response()->json([
            'semester' => $semester->name ?? null,
            'tuition_fees' => $tuitionFees
        ]);
    }

    public function show($id)
    {
        $tuitionFee = TuitionFee::find($id);

        if (!$tuitionFee) {
            return response()->json(['message' => 'Không tìm thấy bản ghi học phí.'], 404);
        }

        return response()->json($tuitionFee);
    }

    public function update(UpdateTuitionFeeRequest $request, $id)
    {
        $tuitionFee = TuitionFee::find($id);

        if (!$tuitionFee) {
            return response()->json(['message' => 'Không tìm thấy bản ghi học phí.'], 404);
        }

        $tuitionFee->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật học phí thành công.',
            'data' => $tuitionFee,
        ]);
    }

    public function destroy($id)
    {
        $tuitionFee = TuitionFee::find($id);

        if (!$tuitionFee) {
            return response()->json(['message' => 'Không tìm thấy bản ghi học phí.'], 404);
        }

        $tuitionFee->delete();

        return response()->json(['message' => 'Xóa học phí thành công.']);
    }
}
