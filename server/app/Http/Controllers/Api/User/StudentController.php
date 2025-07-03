<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateStudentRequest;
use App\Http\Requests\CreateStudentWithParentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Requests\UpdateStudentWithParentRequest;
use App\Models\GuardianModel;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Danh sách tất cả sinh viên.
     */
    public function index(): JsonResponse
    {
        $students = Student::with(['user', 'schoolClass'])->get(); // class => quan hệ với school_classes
        return response()->json($students);
    }

    /**
     * Tạo sinh viên mới.
     */
    // public function store(CreateStudentRequest $request): JsonResponse
    // {
    //     $student = Student::create($request->validated());

    //     return response()->json([
    //         'message' => 'Tạo sinh viên thành công.',
    //         'data' => $student,
    //     ], 201);
    // }

    public function store(CreateStudentWithParentRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $studentData = $request->input('student');

            // Tạo user cho sinh viên
            $studentUser = User::create([
                ...Arr::only($studentData, [
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'sex',
                    'date_of_birth',
                    'address',
                    'phone',
                    'identity_number',
                    'issued_date',
                    'issued_place',
                    'religion',
                    'ethnicity'
                ]),
                'password' => Hash::make($studentData['password']),
                'role' => 'student',
            ]);

            // Tạo bản ghi sinh viên
            $student = Student::create([
                'code' => $studentData['code'],
                'class_id' => $studentData['class_id'],
                'user_id' => $studentUser->id,
                'place_of_birth' => $studentData['place_of_birth'] ?? null,
                'status' => $studentData['status'] ?? 'studying',
            ]);

            $guardian = null;

            // Nếu có phụ huynh
            if ($request->filled('parent.username')) {
                $parentData = $request->input('parent');

                $parentUser = User::create([
                    ...Arr::only($parentData, [
                        'username',
                        'email',
                        'first_name',
                        'last_name',
                        'sex',
                        'date_of_birth',
                        'address',
                        'phone',
                        'identity_number',
                        'issued_date',
                        'issued_place',
                        'religion',
                        'ethnicity'
                    ]),
                    'password' => Hash::make($parentData['password']),
                    'role' => 'parent',
                ]);

                $guardian = GuardianModel::create([
                    'user_id' => $parentUser->id,
                    'student_code' => $student->code,
                ]);
            }

            DB::commit();

            $student->load('user', 'schoolClass');

            return response()->json([
                'message' => 'Tạo sinh viên thành công.',
                'student' => $student,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json([
                'error' => 'Lỗi khi tạo sinh viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Lấy thông tin một sinh viên theo mã.
     */
    // public function show(string $code): JsonResponse
    // {
    //     $student = Student::with(['user', 'schoolClass'])->find($code);

    //     if (!$student) {
    //         return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
    //     }

    //     return response()->json($student);
    // }

    /**
     * Lấy thông tin một sinh viên theo user_id.
     */
    public function show(string $userId): JsonResponse
    {
        $student = Student::with(['user', 'schoolClass'])->where('user_id', $userId)->first();

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
        }

        return response()->json($student);
    }



    /**
     * Cập nhật thông tin sinh viên.
     */
    // public function update(UpdateStudentRequest $request, string $code): JsonResponse
    // {
    //     $student = Student::find($code);

    //     if (!$student) {
    //         return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
    //     }

    //     $student->update($request->validated());

    //     return response()->json([
    //         'message' => 'Cập nhật sinh viên thành công.',
    //         'data' => $student,
    //     ]);
    // }

    public function update(UpdateStudentWithParentRequest $request, $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $student = Student::findOrFail($id);
            $studentData = $request->input('student');
            $studentUser = $student->user;

            // Cập nhật thông tin User (sinh viên)
            $studentUser->update([
                ...\Illuminate\Support\Arr::only($studentData, [
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'sex',
                    'date_of_birth',
                    'address',
                    'phone',
                    'identity_number',
                    'issued_date',
                    'issued_place',
                    'religion',
                    'ethnicity'
                ]),
                'password' => $studentData['password']
                    ? \Illuminate\Support\Facades\Hash::make($studentData['password'])
                    : $studentUser->password,
            ]);

            // Cập nhật thông tin Student
            $student->update([
                'code' => $studentData['code'],
                'class_id' => $studentData['class_id'],
                'place_of_birth' => $studentData['place_of_birth'] ?? null,
                'status' => $studentData['status'] ?? 'studying',
            ]);

            // === Xử lý phụ huynh nếu có ===
            if ($request->filled('parent.username')) {
                $parentData = $request->input('parent');
                $guardian = $student->parents()->first(); // relationship: hasMany => lấy 1 phụ huynh chính

                if ($guardian) {
                    $parentUser = $guardian->user;

                    $parentUser->update([
                        ...\Illuminate\Support\Arr::only($parentData, [
                            'username',
                            'email',
                            'first_name',
                            'last_name',
                            'sex',
                            'date_of_birth',
                            'address',
                            'phone',
                            'identity_number',
                            'issued_date',
                            'issued_place',
                            'religion',
                            'ethnicity'
                        ]),
                        'password' => $parentData['password']
                            ? \Illuminate\Support\Facades\Hash::make($parentData['password'])
                            : $parentUser->password,
                    ]);
                } else {
                    // Nếu chưa có phụ huynh => tạo mới
                    $newParentUser = User::create([
                        ...\Illuminate\Support\Arr::only($parentData, [
                            'username',
                            'email',
                            'first_name',
                            'last_name',
                            'sex',
                            'date_of_birth',
                            'address',
                            'phone',
                            'identity_number',
                            'issued_date',
                            'issued_place',
                            'religion',
                            'ethnicity'
                        ]),
                        'password' => \Illuminate\Support\Facades\Hash::make($parentData['password']),
                        'role' => 'parent',
                    ]);

                    \App\Models\GuardianModel::create([
                        'user_id' => $newParentUser->id,
                        'student_code' => $student->code,
                    ]);
                }
            }

            DB::commit();

            $student->load('user', 'schoolClass');

            return response()->json([
                'message' => 'Cập nhật sinh viên thành công.',
                'student' => $student,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json([
                'error' => 'Lỗi khi cập nhật sinh viên.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function destroy(string $code): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Tìm sinh viên theo mã và load user + phụ huynh
            $student = Student::with(['user', 'parents.user'])->where('code', $code)->firstOrFail();

            // Xóa các phụ huynh nếu có
            foreach ($student->parents as $guardian) {
                if ($guardian->user) {
                    $guardian->user->delete(); // Xóa tài khoản phụ huynh
                }
                $guardian->delete(); // Xóa bản ghi guardian
            }

            // Xóa tài khoản sinh viên
            if ($student->user) {
                $student->user->delete();
            }

            // Xóa sinh viên
            $student->delete();

            DB::commit();

            return response()->json([
                'message' => 'Xóa sinh viên theo mã thành công.',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json([
                'error' => 'Lỗi khi xóa sinh viên theo mã.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getStudentSummaryByUserId($userId): JsonResponse
    {
        // Tìm sinh viên theo user_id, kèm thông tin lớp và user
        $student = Student::with(['schoolClass', 'user'])
            ->where('user_id', $userId)
            ->first();

        if (!$student) {
            return response()->json(['message' => 'Không tìm thấy sinh viên.'], 404);
        }

        // Ưu tiên học kỳ hiện tại, nếu không có thì học kỳ sắp tới
        $today = Carbon::today();

        $currentSemester = Semester::where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->first();

        if (!$currentSemester) {
            $currentSemester = Semester::where('start_date', '>', $today)
                ->orderBy('start_date', 'asc')
                ->first();
        }

        if (!$currentSemester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ phù hợp.'], 404);
        }

        // Lấy các đăng ký trong học kỳ hiện tại
        $registrations = $student->registrations()
            ->whereHas('lesson', function ($query) use ($currentSemester) {
                $query->where('semester_id', $currentSemester->id);
            })
            ->with('lesson.teacherSubject.subject')
            ->get();

        $totalCredits = $registrations->sum(function ($registration) {
            return $registration->lesson->teacherSubject->subject->credit ?? 0;
        });

        $finishedSubjectsCount = $registrations->where('status', 'finished')->count();

        return response()->json([
            'student_code' => $student->code,
            'full_name' => $student->user->last_name . " " . $student->user->first_name,
            'email' => $student->user->email ?? null,
            'phone' => $student->user->phone ?? null,
            'class' => $student->schoolClass->name ?? null,
            'status' => $student->status,
            'status_label' => $student->status_label,
            'semester' => $currentSemester->name,
            'semester_id' => $currentSemester->id,
            'registration_count' => $registrations->count(),
            'total_credits' => $totalCredits,
            'finished_subjects_count' => $finishedSubjectsCount,
        ]);
    }
}
