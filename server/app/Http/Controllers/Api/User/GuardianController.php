<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateGuardianRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Models\GuardianModel;
use Illuminate\Http\Request;

class GuardianController extends Controller
{
    public function index()
    {
        $parents = GuardianModel::with(['user', 'student.user'])->get();

        return response()->json([
            'data' => $parents,
        ]);
    }

    public function getParentByStudentCode($student_code)
    {
        $parents = GuardianModel::with(['user', 'student.user'])
            ->where('student_code', $student_code)
            ->first();

        return response()->json([
            'data' => $parents,
        ]);
    }


    public function store(CreateGuardianRequest $request)
    {
        $parent = GuardianModel::create($request->validated());
        $parent->load('user', 'student.user');

        return response()->json([
            'message' => 'Thêm phụ huynh thành công.',
            'data' => $parent,
        ], 201);
    }

    public function show(string $user_id)
    {
        $parent = GuardianModel::with(['user', 'student'])->find($user_id);
        $parent->load('user', 'student.user');

        if (!$parent) {
            return response()->json(['message' => 'Không tìm thấy phụ huynh.'], 404);
        }

        return response()->json(['data' => $parent]);
    }

    public function update(UpdateGuardianRequest $request, string $user_id)
    {
        // Tìm phụ huynh theo user_id (vì user_id là khóa chính trong bảng parents)
        $parent = GuardianModel::find($user_id);

        if (!$parent) {
            return response()->json(['message' => 'Không tìm thấy phụ huynh.'], 404);
        }

        $data = $request->validated();

        // Cập nhật bảng users
        $userData = array_filter([
            'email' => $data['email'] ?? null,
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'sex' => $data['sex'] ?? null,
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'address' => $data['address'] ?? null,
            'phone' => $data['phone'] ?? null,
            'identity_number' => $data['identity_number'] ?? null,
            'issued_date' => $data['issued_date'] ?? null,
            'issued_place' => $data['issued_place'] ?? null,
            'ethnicity' => $data['ethnicity'] ?? null,
            'religion' => $data['religion'] ?? null,
        ], fn($value) => !is_null($value)); // Chỉ update field nào được gửi

        $parent->user->update($userData);

        // Cập nhật bảng parents (nếu có student_code)
        if (isset($data['student_code'])) {
            $parent->update([
                'student_code' => $data['student_code'],
            ]);
        }

        $parent->load('user', 'student.user');

        return response()->json([
            'message' => 'Cập nhật phụ huynh thành công.',
            'data' => $parent,
        ]);
    }


    public function destroy(string $user_id)
    {
        $parent = GuardianModel::find($user_id);

        if (!$parent) {
            return response()->json(['message' => 'Không tìm thấy phụ huynh.'], 404);
        }

        $parent->delete();

        return response()->json(['message' => 'Xóa phụ huynh thành công.']);
    }
}
