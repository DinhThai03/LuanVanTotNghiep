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
        $parents = GuardianModel::with(['user', 'student'])->get();

        return response()->json([
            'data' => $parents,
        ]);
    }

    public function store(CreateGuardianRequest $request)
    {
        $parent = GuardianModel::create($request->validated());

        return response()->json([
            'message' => 'Thêm phụ huynh thành công.',
            'data' => $parent,
        ], 201);
    }

    public function show(string $user_id)
    {
        $parent = GuardianModel::with(['user', 'student'])->find($user_id);

        if (!$parent) {
            return response()->json(['message' => 'Không tìm thấy phụ huynh.'], 404);
        }

        return response()->json(['data' => $parent]);
    }

    public function update(UpdateGuardianRequest $request, string $user_id)
    {
        $parent = GuardianModel::find($user_id);

        if (!$parent) {
            return response()->json(['message' => 'Không tìm thấy phụ huynh.'], 404);
        }

        $parent->update($request->validated());

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
