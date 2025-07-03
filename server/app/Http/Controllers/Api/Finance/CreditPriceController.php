<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateCreditPriceRequest;
use App\Http\Requests\UpdateCreditPriceRequest;
use App\Models\CreditPrice;

class CreditPriceController extends Controller
{
    public function index()
    {
        $creditPrice = CreditPrice::with('academicYear')->orderBy('academic_year_id', 'desc')->get();
        return response()->json($creditPrice);
    }

    public function store(CreateCreditPriceRequest $request)
    {
        $creditPrice = CreditPrice::create($request->validated());

        return response()->json([
            'message' => 'Tạo đơn giá tín chỉ thành công.',
            'data' => $creditPrice,
        ], 201);
    }

    public function show($id)
    {
        $creditPrice = CreditPrice::find($id);
        $creditPrice->load('academicYear');

        if (!$creditPrice) {
            return response()->json(['message' => 'Không tìm thấy đơn giá tín chỉ.'], 404);
        }

        return response()->json($creditPrice);
    }

    public function update(UpdateCreditPriceRequest $request, $id)
    {
        $creditPrice = CreditPrice::find($id);

        if (!$creditPrice) {
            return response()->json(['message' => 'Không tìm thấy đơn giá tín chỉ.'], 404);
        }


        $creditPrice->update($request->validated());
        $creditPrice->load('academicYear');

        return response()->json([
            'message' => 'Cập nhật đơn giá tín chỉ thành công.',
            'data' => $creditPrice,
        ]);
    }

    public function destroy($id)
    {
        $creditPrice = CreditPrice::find($id);

        if (!$creditPrice) {
            return response()->json(['message' => 'Không tìm thấy đơn giá tín chỉ.'], 404);
        }

        $creditPrice->delete();

        return response()->json(['message' => 'Xóa đơn giá tín chỉ thành công.']);
    }
}
