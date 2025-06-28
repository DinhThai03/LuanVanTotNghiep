<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateRegistrationRequest;
use App\Http\Requests\UpdateRegistrationRequest;
use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = Registration::with([
            'student.user',
            'lesson.room',
            'lesson.teacherSubject.teacher.user',
            'lesson.teacherSubject.subject'
        ]);

        if ($request->has('semester_id')) {
            $query->whereHas('lesson', function ($q) use ($request) {
                $q->where('semester_id', $request->semester_id);
            });
        }

        if ($request->has('class_id')) {
            $query->whereHas('student.schoolClass', function ($q) use ($request) {
                $q->where('class_id', $request->class_id);
            });
        }

        if ($request->has('faculty_id')) {
            $query->whereHas('lesson.teacherSubject.subject', function ($q) use ($request) {
                $q->whereHas('facultySubjects', function ($subQ) use ($request) {
                    $subQ->where('faculty_id', $request->faculty_id);
                })->orWhereDoesntHave('facultySubjects');
            });
        }

        $registrations = $query->get();

        return response()->json($registrations);
    }


    public function store(CreateRegistrationRequest $request)
    {
        $registration = Registration::create($request->validated());

        $registration->load(
            'student.user',
            'lesson.room',
            'lesson.teacherSubject.teacher.user',
            'lesson.teacherSubject.subject'
        );

        return response()->json([
            'message' => 'Tạo đăng ký thành công.',
            'data' => $registration,
        ], 201);
    }

    public function show($id)
    {
        $registration = Registration::find($id);
        $registration->load(
            'student.user',
            'lesson.room',
            'lesson.teacherSubject.teacher.user',
            'lesson.teacherSubject.subject'
        );

        if (!$registration) {
            return response()->json(['message' => 'Không tìm thấy đăng ký.'], 404);
        }

        return response()->json($registration);
    }

    public function update(UpdateRegistrationRequest $request, $id)
    {
        $registration = Registration::find($id);

        if (!$registration) {
            return response()->json(['message' => 'Không tìm thấy đăng ký.'], 404);
        }

        $registration->update($request->validated());

        $registration->load(
            'student.user',
            'lesson.room',
            'lesson.teacherSubject.teacher.user',
            'lesson.teacherSubject.subject'
        );

        return response()->json([
            'message' => 'Cập nhật đăng ký thành công.',
            'data' => $registration,
        ]);
    }

    public function destroy($id)
    {
        $registration = Registration::find($id);

        if (!$registration) {
            return response()->json(['message' => 'Không tìm thấy đăng ký.'], 404);
        }

        $registration->delete();

        return response()->json(['message' => 'Xóa đăng ký thành công.']);
    }
}
