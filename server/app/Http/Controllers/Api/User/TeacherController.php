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
use App\Imports\TeachersImport;
use App\Models\Semester;
use App\Models\SemesterSubject;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

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

    public static function getTeacherWithUserByUserId(int $id)
    {
        return Teacher::with('user')->where('user_id', $id)->first();
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

    public function getTeacherByUserId($userId): JsonResponse
    {
        $teacher = Teacher::with(['user', 'faculty', 'teacherSubjects.subject', 'teacherSubjects.lessons'])
            ->where('user_id', $userId)
            ->first();

        if (!$teacher) {
            return response()->json(['message' => 'Không tìm thấy giáo viên'], 404);
        }

        // Tìm học kỳ hiện tại, nếu không có thì lấy học kỳ gần nhất
        $today = Carbon::today();

        $semester = Semester::where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->first();

        if (!$semester) {
            $semester = Semester::orderByDesc('end_date')->first();
        }

        if (!$semester) {
            return response()->json(['message' => 'Không có học kỳ nào trong hệ thống'], 404);
        }

        $semesterId = $semester->id;

        // Lấy danh sách subject_id trong semester này
        $subjectIdsInSemester = SemesterSubject::where('semester_id', $semesterId)
            ->pluck('subject_id')
            ->toArray();

        // Lấy tất cả subject mà giáo viên đang dạy
        $teacherSubjects = $teacher->teacherSubjects;

        // Lọc ra subject mà giáo viên dạy và thuộc học kỳ
        $filteredSubjects = $teacherSubjects
            ->filter(fn($ts) => in_array($ts->subject_id, $subjectIdsInSemester))
            ->pluck('subject')
            ->unique('id');

        // Lấy lessons theo semester
        $filteredLessons = $teacherSubjects->flatMap(function ($ts) use ($semesterId) {
            return $ts->lessons->where('semester_id', $semesterId);
        });

        return response()->json([
            'code' => $teacher->code,
            'status' => $teacher->status,
            'semester' => [
                'id' => $semester->id,
                'name' => $semester->name,
                'start_date' => $semester->start_date,
                'end_date' => $semester->end_date,
            ],
            'faculty' => [
                'id' => $teacher->faculty->id,
                'name' => $teacher->faculty->name,
            ],
            'user' => [
                'id' => $teacher->user->id,
                'username' => $teacher->user->username,
                'full_name' => $teacher->user->full_name,
                'email' => $teacher->user->email,
                'phone' => $teacher->user->phone,
                'address' => $teacher->user->address,
                'is_active' => $teacher->user->is_active,
            ],
            'total_subjects' => $filteredSubjects->count(),
            'total_lessons' => $filteredLessons->count(),
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        $import = new TeachersImport();

        try {
            DB::beginTransaction();

            Excel::import($import, $request->file('file'));

            DB::commit();

            $errors = $import->getErrors();

            if (!empty($errors)) {
                return response()->json([
                    'message' => 'Một số dòng không thể nhập.',
                    'errors' => $errors
                ], 422); // Trả về lỗi xác thực để hiển thị ở phía client
            }

            return response()->json([
                'message' => 'Nhập dữ liệu giáo viên thành công.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Lỗi khi nhập dữ liệu giáo viên.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
