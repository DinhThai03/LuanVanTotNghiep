<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateTuitionFeeRequest;
use App\Http\Requests\UpdateTuitionFeeRequest;
use App\Models\TuitionFee;

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
