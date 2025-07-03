<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Models\Grade;

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
}
