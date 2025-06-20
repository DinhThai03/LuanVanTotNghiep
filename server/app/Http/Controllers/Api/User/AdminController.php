<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\Controller;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

use function Pest\Laravel\get;

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
    public function store(Request $request)
    {
        $currentUser = Auth::user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ admin mới có quyền thêm admin.'], 403);
        }

        $userRequest = new CreateUserRequest();
        $userValidator = Validator::make(
            $request->all(),
            $userRequest->rules(),
            $userRequest->messages()
        );

        if ($userValidator->fails()) {
            throw new ValidationException($userValidator);
        }

        $adminRequest = new UpdateAdminRequest();
        $adminValidator = Validator::make(
            $request->all(),
            $adminRequest->rules(),
            $adminRequest->messages()
        );

        if ($adminValidator->fails()) {
            throw new ValidationException($adminValidator);
        }

        try {
            DB::beginTransaction();

            $userData = $userValidator->validated();
            $userData['password'] = bcrypt($userData['password']);
            $user = User::create($userData);

            $adminData = $adminValidator->validated();
            $adminData['user_id'] = $user->id;
            $admin = Admin::create($adminData);

            DB::commit();

            $admin->load('user');

            return response()->json([
                'message' => 'Tạo quản trị viên và người dùng thành công.',
                'admin' => $admin,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi tạo quản trị viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
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

    public function update(Request $request, $user_id)
    {
        $currentUser = Auth::user();

        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ có admin mới có quyền chỉnh sửa.'], 403);
        }

        // Kiểm tra tồn tại user và admin
        $user = User::find($user_id);
        $admin = Admin::where('user_id', $user_id)->first();

        if (!$user || !$admin) {
            return response()->json(['error' => 'Không tìm thấy người dùng hoặc quản trị viên.'], 404);
        }

        // Validator
        $userValidator = Validator::make(
            $request->all(),
            (new UpdateUserRequest())->rules(),
            (new UpdateUserRequest())->messages()
        );

        $adminValidator = Validator::make(
            $request->all(),
            (new UpdateAdminRequest())->rules(),
            (new UpdateAdminRequest())->messages()
        );

        if ($userValidator->fails()) {
            throw new ValidationException($userValidator);
        }

        if ($adminValidator->fails()) {
            throw new ValidationException($adminValidator);
        }

        try {
            DB::beginTransaction();

            $userData = $userValidator->validated();
            $adminData = $adminValidator->validated();

            // Nếu có thay đổi level thì kiểm tra quyền của currentAdmin
            if (isset($adminData['admin_level']) && $adminData['admin_level'] != $admin->admin_level) {
                $currentAdmin = Admin::where('user_id', $currentUser->id)->first();

                if ($currentUser->id == $user_id && $request->get('admin_level') != $currentAdmin->admin_level) {
                    return response()->json(['error' => 'Không được phép sửa level của bản thân!.'], 403);
                }


                if (!$currentAdmin || $currentAdmin->admin_level !== 1) {
                    return response()->json(['error' => 'Chỉ có admin cấp 1 mới được chỉnh sửa level.'], 403);
                }
            }

            // Xử lý mật khẩu nếu có
            if (!empty($userData['password'])) {
                $userData['password'] = Hash::make($userData['password']);
            } else {
                unset($userData['password']);
            }

            $user->update($userData);
            $admin->update($adminData);

            DB::commit();
            $admin->load('user');

            return response()->json([
                'message' => 'Cập nhật quản trị viên và người dùng thành công.',
                'admin' => $admin,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi cập nhật quản trị viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Xoá một admin.
     */
    public function destroy($user_id)
    {
        $currentUser = Auth::user();

        // Chỉ cho phép admin thực hiện xoá
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ có admin mới có quyền xoá.'], 403);
        }

        // Không cho phép tự xoá chính mình
        if ($currentUser->id == $user_id) {
            return response()->json(['error' => 'Không được phép xóa tài khoản của bản thân.'], 403);
        }

        // Tìm admin theo user_id
        $admin = Admin::where('user_id', $user_id)->first();
        $user = User::find($user_id);

        if (!$admin || !$user) {
            return response()->json(['error' => 'Không tìm thấy người dùng hoặc quản trị viên.'], 404);
        }

        try {
            DB::beginTransaction();

            // Xoá cả admin và user nếu cần
            $admin->delete();
            $user->delete();

            DB::commit();

            return response()->json(['message' => 'Xoá quản trị viên và người dùng thành công.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi xoá.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
