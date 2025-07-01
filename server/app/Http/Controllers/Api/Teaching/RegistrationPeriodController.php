<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\UpdateRegistrationPeriodRequest;
use App\Models\RegistrationPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegistrationPeriodController extends Controller
{
    public function index(Request $request)
    {
        $semesterId = $request->query('semester_id');

        if (!$semesterId) {
            return response()->json([
                'message' => 'Thiếu tham số semester_id'
            ], 400);
        }

        $periods = RegistrationPeriod::where('semester_id', $semesterId)
            ->select('faculty_id', 'round1_start', 'round1_end', 'round2_start', 'round2_end')
            ->get();

        return response()->json([
            'semester_id' => (int) $semesterId,
            'faculties' => $periods
        ]);
    }


    public function storeBulk(Request $request)
    {
        $data = $request->all();

        // Kiểm tra dữ liệu
        $validator = Validator::make($data, [
            'semester_id' => 'required|exists:semesters,id',
            'faculties' => 'required|array|min:1',
            'faculties.*.faculty_id' => 'required|exists:faculties,id',
            'faculties.*.round1_start' => 'required|date',
            'faculties.*.round1_end' => 'required|date|after_or_equal:faculties.*.round1_start',
            'faculties.*.round2_start' => 'required|date|after_or_equal:faculties.*.round1_end',
            'faculties.*.round2_end' => 'required|date|after_or_equal:faculties.*.round2_start',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $semesterId = $data['semester_id'];
        $faculties = $data['faculties'];
        $processed = [];

        foreach ($faculties as $item) {
            $condition = [
                'semester_id' => $semesterId,
                'faculty_id' => $item['faculty_id'],
            ];

            $values = [
                'round1_start' => $item['round1_start'],
                'round1_end' => $item['round1_end'],
                'round2_start' => $item['round2_start'],
                'round2_end' => $item['round2_end'],
                'updated_at' => now(),
            ];

            // Thêm created_at nếu là insert mới
            $exists = RegistrationPeriod::where($condition)->exists();
            if (!$exists) {
                $values['created_at'] = now();
            }

            RegistrationPeriod::updateOrInsert($condition, $values);

            $processed[] = array_merge($condition, $values);
        }

        return response()->json([
            'message' => 'Thêm hoặc cập nhật đợt đăng ký thành công',
            'data' => $processed,
        ]);
    }


    public function update(UpdateRegistrationPeriodRequest $request, $id): JsonResponse
    {
        $period = RegistrationPeriod::findOrFail($id);
        $period->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $period
        ]);
    }

    // Xóa
    public function destroy($id): JsonResponse
    {
        $period = RegistrationPeriod::findOrFail($id);
        $period->delete();

        return response()->json(['message' => 'Xóa thành công']);
    }
}
