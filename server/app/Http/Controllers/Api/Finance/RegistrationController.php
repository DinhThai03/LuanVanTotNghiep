<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateRegistrationRequest;
use App\Http\Requests\UpdateRegistrationRequest;
use App\Models\Registration;
use App\Models\Semester;
use Carbon\Carbon;
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

    public function getApprovedRegistrationsByStudent(Request $request)
    {
        $code = $request->input('code');
        $now = Carbon::now();

        // 1. Tìm học kỳ hiện tại
        $currentSemester = Semester::where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->first();

        // 2. Nếu không có học kỳ hiện tại, tìm học kỳ kế tiếp gần nhất
        if (!$currentSemester) {
            $currentSemester = Semester::where('start_date', '>', $now)
                ->orderBy('start_date', 'asc')
                ->first();
        }

        // 3. Nếu vẫn không có học kỳ
        if (!$currentSemester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ hiện tại hoặc sắp tới'], 404);
        }

        // 4. Lấy danh sách đăng ký đã được duyệt
        $registrations = Registration::with([
            'lesson.room',
            'lesson.teacherSubject.teacher.user',
            'lesson.teacherSubject.subject',
            'student.user',
        ])
            ->where('status', 'approved')
            ->whereHas('student', function ($query) use ($code) {
                $query->where('code', $code);
            })
            ->whereHas('lesson', function ($query) use ($currentSemester) {
                $query->where('semester_id', $currentSemester->id);
            })
            ->get();

        // 5. Map lại dữ liệu trả về


        $mappedData = $registrations->map(function ($item) {
            $lesson = $item->lesson;
            $subjectTeacher = $lesson->teacherSubject;
            $teacher = $subjectTeacher->teacher;
            $subject = $subjectTeacher->subject;
            $room = $lesson->room;

            return [
                'id' => $item->id,
                'title' => $subject->name ?? '',
                'subject' => $subject,
                'teacher' => $teacher,
                'allDay' => false,
                'startDate' => Carbon::parse($lesson->start_date)->format('Y-m-d'),
                'endDate' => Carbon::parse($lesson->end_date)->format('Y-m-d'),
                'startTime' => Carbon::parse($lesson->start_time)->format('H:i:s'),
                'endTime' => Carbon::parse($lesson->end_time)->format('H:i:s'),
                'room' => $room->name,
                'repeat' => 'weekly',
                'dayOfWeek' => $lesson->day_of_week,
            ];
        });

        return response()->json($mappedData);
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
