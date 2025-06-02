<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\AdminRequest;
use App\Http\Requests\CreateAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Monolog\Level;

class AdminController extends Controller
{
    /**
     * Danh sách tất cả admin.
     */
    public function index(): JsonResponse
    {
        $currentUser = Auth::user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ có admin mới có quyền xem.'], 403);
        }
        $admins = Admin::with('user')->get();
        return response()->json($admins);
    }

    /**
     * Tạo mới admin.
     */
    public function store(CreateAdminRequest $request)
    {
        $currentUser = Auth::user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ có admin mới có quyền thêm admin mới.'], 403);
        }
        $admin = Admin::create($request->validated());
        return response()->json([
            'message' => 'Tạo quản trị viên thành công.',
            'data' => $admin,
        ], 201);
    }

    /**
     * Xem chi tiết một admin.
     */
    public function show($user_id)
    {
        $currentUser = Auth::user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ có admin mới có quyền xem.'], 403);
        }
        $admin = Admin::with('user')->find($user_id);
        if (!$admin) {
            return response()->json(['message' => 'Không tìm thấy quản trị viên.'], 404);
        }

        return response()->json($admin);
    }

    /**
     * Cập nhật admin.
     */
    public function update(UpdateAdminRequest $request, $user_id)
    {

        $currentUser = Auth::user();
        if ($currentUser->id == $user_id)
            return response()->json(['error' => 'Không được phép sửa level của bản thân!.'], 403);
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ có admin mới có quyền chỉnh sửa.'], 403);
        }
        $currentAdmin = Admin::find($currentUser->id);
        // return response()->json($currentAdmin->admin_level);
        if (!$currentAdmin || $currentAdmin->admin_level !== 1)
            return response()->json(['error' => 'Không được phép! Chỉ có admin level 1 mới có quyền chỉnh sửa.'], 403);
        $admin = Admin::find($user_id);
        if (!$admin) {
            return response()->json(['message' => 'Không tìm thấy quản trị viên.'], 404);
        }

        $admin->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật quản trị viên thành công.',
            'data' => $admin,
        ]);
    }

    /**
     * Xoá một admin.
     */
    public function destroy($user_id)
    {
        $currentUser = Auth::user();
        if ($currentUser->id == $user_id)
            return response()->json(['error' => 'Không được phép xóa tài khoản của bản thân.'], 403);
        $admin = Admin::find($user_id);
        if (!$admin) {
            return response()->json(['message' => 'Không tìm thấy quản trị viên.'], 404);
        }

        $admin->delete();

        return response()->json(['message' => 'Xoá quản trị viên thành công.']);
    }
}
