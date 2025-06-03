<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Models\Grade;

class GradeController extends Controller
{
    public function index()
    {
        return response()->json(Grade::all());
    }

    public function store(CreateGradeRequest $request)
    {
        $grade = Grade::create($request->validated());

        return response()->json([
            'message' => 'Thêm điểm thành công.',
            'data' => $grade,
        ], 201);
    }

    public function show($registration_id)
    {
        $grade = Grade::find($registration_id);

        if (!$grade) {
            return response()->json(['message' => 'Không tìm thấy điểm.'], 404);
        }

        return response()->json($grade);
    }

    public function update(UpdateGradeRequest $request, $registration_id)
    {
        $grade = Grade::find($registration_id);

        if (!$grade) {
            return response()->json(['message' => 'Không tìm thấy điểm.'], 404);
        }

        $grade->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật điểm thành công.',
            'data' => $grade,
        ]);
    }

    public function destroy($registration_id)
    {
        $grade = Grade::find($registration_id);

        if (!$grade) {
            return response()->json(['message' => 'Không tìm thấy điểm.'], 404);
        }

        $grade->delete();

        return response()->json(['message' => 'Xóa điểm thành công.']);
    }
}
