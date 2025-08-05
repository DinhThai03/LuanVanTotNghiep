<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Imports\GradesImport;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class GradeController extends Controller
{
    public function index()
    {
        $query = Grade::with([
            'registration.student.user',
            'registration.lesson.teacherSubject.teacher.user',
            'registration.lesson.teacherSubject.subject',
            'registration.lesson.semester.academicYear',
            'registration.student.schoolClass'
        ])
            ->when(request()->has('academic_year_id'), function ($q) {
                $q->whereHas('registration.lesson.semester', function ($q2) {
                    $q2->where('academic_year_id', request('academic_year_id'));
                });
            })
            ->when(request()->has('semester_id'), function ($q) {
                $q->whereHas('registration.lesson', function ($q2) {
                    $q2->where('semester_id', request('semester_id'));
                });
            })
            ->when(request()->has('lesson_id'), function ($q) {
                $q->whereHas('registration', function ($q2) {
                    $q2->where('lesson_id', request('lesson_id'));
                });
            })
            ->when(request()->has('class_id'), function ($q) {
                $q->whereHas('registration.student', function ($q2) {
                    $q2->where('class_id', request('class_id'));
                });
            })
            ->get();

        return response()->json($query);
    }


    public function store(CreateGradeRequest $request)
    {
        $grade = Grade::create($request->validated());

        return response()->json([
            'message' => 'Thêm điểm thành công.',
            'data' => $grade,
        ], 201);
    }

    public function show($registration_id)
    {
        $grade = Grade::find($registration_id);

        if (!$grade) {
            return response()->json(['message' => 'Không tìm thấy điểm.'], 404);
        }

        return response()->json($grade);
    }

    public function update(UpdateGradeRequest $request, $registration_id)
    {
        $grade = Grade::find($registration_id);

        if (!$grade) {
            return response()->json(['message' => 'Không tìm thấy điểm.'], 404);
        }

        $grade->update($request->validated());
        $grade->load([
            'registration.student.user',
            'registration.lesson.teacherSubject.teacher.user',
            'registration.lesson.teacherSubject.subject',
            'registration.lesson.semester.academicYear',
            'registration.student.schoolClass'
        ]);

        return response()->json([
            'message' => 'Cập nhật điểm thành công.',
            'data' => $grade,
        ]);
    }

    public function destroy($registration_id)
    {
        $grade = Grade::find($registration_id);

        if (!$grade) {
            return response()->json(['message' => 'Không tìm thấy điểm.'], 404);
        }

        $grade->delete();

        return response()->json(['message' => 'Xóa điểm thành công.']);
    }

    public function getStudentGrades($user_id)
    {
        $student = Student::with([
            'registrations.grade',
            'registrations.lesson.semester.academicYear',
            'registrations.lesson.teacherSubject.subject',
        ])->where('user_id', $user_id)->first();

        if (!$student) {
            return response()->json([
                'message' => 'Sinh viên không tồn tại',
            ], 404);
        }

        $grouped = $student->registrations
            ->filter(fn($reg) => $reg->grade && $reg->lesson && $reg->lesson->semester)
            ->groupBy(fn($reg) => $reg->lesson->semester->id);

        $result = [];

        foreach ($grouped as $semesterId => $registrations) {
            $semester = $registrations->first()->lesson->semester;
            $grades = [];

            foreach ($registrations as $index => $reg) {
                $subject = $reg->lesson->teacherSubject->subject;
                $grade = $reg->grade;

                $avg = $grade->average_score;

                $grades[] = [
                    'stt' => $index + 1,
                    'subject_code' => $subject->code,
                    'subject_name' => $subject->name,
                    'credit' => $subject->credit,
                    'process_percent' => floatval($subject->process_percent),
                    'midterm_percent' => floatval($subject->midterm_percent),
                    'process_score' => is_null($grade->process_score) ? null : floatval($grade->process_score),
                    'midterm_score' => is_null($grade->midterm_score) ? null : floatval($grade->midterm_score),
                    'final_score' => is_null($grade->final_score) ? null : floatval($grade->final_score),
                    'average_score' => $avg,
                    'letter_grade' => $grade->letter_grade,
                    'result' => $grade->result, // 1: Đạt, 0: Không đạt
                ];
            }

            $result[] = [
                'semester_name' => $semester->name,
                'academic_year_name' => $semester->academicYear->start_year . " - " . $semester->academicYear->end_year,
                'grades' => $grades,
            ];
        }

        return response()->json($result);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
            'lesson_id' => 'nullable|exists:lessons,id',
        ]);

        $lessonId = $request->input('lesson_id'); // Có thể null
        $import = new GradesImport($lessonId);

        try {
            DB::beginTransaction();

            Excel::import($import, $request->file('file'));

            DB::commit();

            $errors = $import->getErrors();

            if (!empty($errors)) {
                return response()->json([
                    'message' => 'Một số dòng không thể nhập.',
                    'errors' => $errors
                ], 422);
            }

            return response()->json([
                'message' => 'Nhập dữ liệu điểm thành công.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Lỗi khi nhập dữ liệu điểm.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getGradeByLesson($lesson_id)
    {
        $grades = Grade::with([
            'registration.student.user',
            'registration.lesson.teacherSubject.teacher.user',
            'registration.lesson.teacherSubject.subject',
            'registration.lesson.semester.academicYear',
            'registration.student.schoolClass'
        ])
            ->whereHas('registration.lesson', function ($query) use ($lesson_id) {
                $query->where('id', $lesson_id);
            })
            ->get();

        return response()->json([
            'grade_status' => $grades->isEmpty() ? 'not_graded' : $grades->first()->registration->lesson->grade_status,
            'data' => $grades,
        ])->setStatusCode(200, 'OK');
    }
}
