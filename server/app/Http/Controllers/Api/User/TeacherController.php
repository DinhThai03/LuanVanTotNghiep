<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\Controller;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\CreateTeacherRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateTeacherRequest;

class TeacherController extends Controller
{
    public function index(): JsonResponse
    {
        $teachers = Teacher::with('user', 'teacherSubjects', 'teacherSubjects.subject')->get();
        return response()->json(['data' => $teachers]);
    }

    public function store(Request $request): JsonResponse
    {
        $userValidator = Validator::make(
            $request->all(),
            (new CreateUserRequest())->rules(),
            (new CreateUserRequest())->messages()
        );

        $teacherValidator = Validator::make(
            $request->all(),
            (new CreateTeacherRequest())->rules(),
            (new CreateTeacherRequest())->messages()
        );

        if ($userValidator->fails()) {
            throw new ValidationException($userValidator);
        }

        if ($teacherValidator->fails()) {
            throw new ValidationException($teacherValidator);
        }

        try {
            DB::beginTransaction();

            $userData = $userValidator->validated();
            $userData['password'] = Hash::make($userData['password']);
            $userData['role'] = 'teacher';

            $user = User::create($userData);

            $teacherData = $teacherValidator->validated();
            $teacherData['user_id'] = $user->id;

            $teacher = Teacher::create($teacherData);
            $teacher->subjects()->sync($teacherData['subject_ids'] ?? []);

            $teacher->load('user', 'teacherSubjects', 'teacherSubjects.subject');

            DB::commit();

            return response()->json([
                'message' => 'Thêm giáo viên và tài khoản người dùng thành công.',
                'data' => $teacher,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Lỗi khi tạo giáo viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function show(string $code): JsonResponse
    {
        $teacher = Teacher::with('user')->where('code', $code)->first();

        if (!$teacher) {
            return response()->json(['message' => 'Không tìm thấy giáo viên.'], 404);
        }

        return response()->json(['data' => $teacher]);
    }

    public function update(Request $request, string $code): JsonResponse
    {
        $teacher = Teacher::where('code', $code)->first();

        if (!$teacher || !$teacher->user) {
            return response()->json(['message' => 'Không tìm thấy giáo viên hoặc người dùng.'], 404);
        }

        $userValidator = Validator::make(
            $request->all(),
            (new UpdateUserRequest())->rules(),
            (new UpdateUserRequest())->messages()
        );

        $teacherValidator = Validator::make(
            $request->all(),
            (new UpdateTeacherRequest())->rules(),
            (new UpdateTeacherRequest())->messages()
        );

        if ($userValidator->fails()) {
            throw new ValidationException($userValidator);
        }

        if ($teacherValidator->fails()) {
            throw new ValidationException($teacherValidator);
        }

        try {
            DB::beginTransaction();

            $userData = $userValidator->validated();
            if (!empty($userData['password'])) {
                $userData['password'] = Hash::make($userData['password']);
            } else {
                unset($userData['password']);
            }
            $teacherData = $teacherValidator->validated();

            $teacher->user->update($userData);
            $teacher->update($teacherData);
            $teacher->subjects()->sync($teacherData['subject_ids'] ?? []);

            $teacher->load('user', 'teacherSubjects', 'teacherSubjects.subject');

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật giáo viên và người dùng thành công.',
                'data' => $teacher,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Lỗi khi cập nhật giáo viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $code): JsonResponse
    {
        $teacher = Teacher::where('code', $code)->first();

        if (!$teacher || !$teacher->user) {
            return response()->json(['message' => 'Không tìm thấy giáo viên hoặc người dùng.'], 404);
        }

        try {
            DB::beginTransaction();

            $teacher->delete();
            $teacher->user->delete();

            DB::commit();

            return response()->json(['message' => 'Xoá giáo viên và người dùng thành công.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Lỗi khi xoá giáo viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
