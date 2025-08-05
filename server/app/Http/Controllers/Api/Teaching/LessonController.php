<?php

namespace App\Http\Controllers\Api\Teaching;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\Lesson;
use App\Models\Registration;
use App\Models\Semester;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $query = Lesson::with([
            'teacherSubject.teacher.user',
            'teacherSubject.subject',
            'room',
            'semester.academicYear'
        ]);

        if ($request->has('semester_id')) {
            $query->where('semester_id', $request->semester_id);
        }

        if ($request->has('faculty_id')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('teacherSubject.subject', function ($sub) use ($request) {
                    $sub->whereHas('facultySubjects', function ($inner) use ($request) {
                        $inner->where('faculty_id', $request->faculty_id);
                    });
                })->orWhereHas('teacherSubject.subject', function ($sub) {
                    $sub->doesntHave('facultySubjects');
                });
            });
        }

        return response()->json([
            'data' => $query->get()
        ]);
    }
    public function getGroupedLessons(Request $request)
    {
        $request->validate([
            'faculty_id' => 'required|integer',
            'semester_id' => 'required|integer',
            'year' => 'required|integer',
        ]);

        $facultyId = $request->input('faculty_id');
        $semesterId = $request->input('semester_id');
        $year = $request->input('year');

        $lessons = Lesson::withCount('registrations') // Đếm số SV đã đăng ký
            ->with([
                'teacherSubject.subject',
                'teacherSubject.teacher',
                'room',
            ])
            ->where('semester_id', $semesterId)
            ->where('is_active', true)
            ->whereHas('teacherSubject', function ($query) use ($facultyId, $year) {
                $query->whereHas('subject', function ($q) use ($facultyId, $year) {
                    $q->where('year', $year)
                        ->whereHas('faculties', function ($fq) use ($facultyId) {
                            $fq->where('faculties.id', $facultyId);
                        });
                });
            })
            ->get()
            ->groupBy(fn($lesson) => $lesson->teacherSubject->subject->code)
            ->map(function ($groupedLessons, $subjectCode) {
                $subject = optional($groupedLessons->first()->teacherSubject->subject);

                return [
                    'subject_code' => $subjectCode,
                    'subject_name' => $subject->name,
                    'credit' => $subject->credit,
                    'lessons' => $groupedLessons->map(function ($lesson) {
                        return [
                            'id' => $lesson->id,
                            'day_of_week' => $lesson->day_of_week,
                            'start_time' => $lesson->start_time,
                            'end_time' => $lesson->end_time,
                            'room' => optional($lesson->room)->name,
                            'room_capacity' => optional($lesson->room)->capacity,
                            'registered_count' => $lesson->registrations_count,
                            'teacher' => optional($lesson->teacherSubject->teacher)->name
                                ?? $lesson->teacherSubject->teacher_code,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return response()->json(['data' => $lessons]);
    }


    public function store(CreateLessonRequest $request): JsonResponse
    {
        $lesson = Lesson::create($request->validated());
        $lesson->load('teacherSubject.teacher.user', 'teacherSubject.subject', 'room');

        return response()->json([
            'message' => 'Tạo lịch học thành công.',
            'data' => $lesson,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $lesson = Lesson::with(['teacherSubject'])->find($id);
        if (!$lesson) {
            return response()->json(['message' => 'Không tìm thấy lịch học.'], 404);
        }

        return response()->json(['data' => $lesson]);
    }

    public function update(UpdateLessonRequest $request, $id): JsonResponse
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['message' => 'Không tìm thấy lịch học.'], 404);
        }
            
        $lesson->update($request->validated());
        $lesson->load('teacherSubject.teacher.user', 'teacherSubject.subject', 'room');
        return response()->json([
            'message' => 'Cập nhật lịch học thành công.',
            'data' => $lesson,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $lesson = Lesson::find($id);
        if (!$lesson) {
            return response()->json(['message' => 'Không tìm thấy lịch học.'], 404);
        }

        $lesson->delete();

        return response()->json(['message' => 'Xóa lịch học thành công.']);
    }

    public function getLessonsGroupedBySubject(Request $request)
    {
        $semesterId = $request->input('semester_id');
        $facultyId = $request->input('faculty_id');
        $year = $request->input('year');
        $studentCode = $request->input('student_code');

        if (!$semesterId) {
            return response()->json(['error' => 'semester_id is required'], 422);
        }

        $registeredLessonIds = [];
        if ($studentCode) {
            $registeredLessonIds = Registration::where('student_code', $studentCode)
                ->pluck('lesson_id')
                ->toArray();
        }

        $lessons = Lesson::with([
            'teacherSubject.subject.faculties',
            'room',
            'teacherSubject.teacher.user'
        ])
            ->withCount('registrations')
            ->where('semester_id', $semesterId)
            ->whereHas('teacherSubject.subject', function ($query) use ($facultyId, $year) {
                if ($facultyId) {
                    $query->whereHas('faculties', fn($q) => $q->where('faculties.id', $facultyId));
                }
                if ($year) {
                    $query->where('year', $year);
                }
            })
            ->get()
            ->map(function ($lesson) use ($registeredLessonIds) {
                $lesson->is_registered = in_array($lesson->id, $registeredLessonIds);
                return $lesson;
            })
            ->groupBy(fn($lesson) => $lesson->teacherSubject->subject->code ?? 'unknown');

        return response()->json($lessons);
    }

    public function getLessonsByTeacher(Request $request)
    {
        $teacherCode = $request->input('teacher_code'); // yêu cầu truyền mã giảng viên
        $semesterId = $request->input('semester_id');

        if (!$teacherCode) {
            return response()->json(['error' => 'teacher_code is required'], 422);
        }

        // Nếu không có semester_id, tìm học kỳ hiện tại hoặc gần nhất
        if (!$semesterId) {
            $today = now()->toDateString();

            $semester = Semester::where('start_date', '<=', $today)
                ->where('end_date', '>=', $today)
                ->first();

            if (!$semester) {
                $semester = Semester::orderByRaw("ABS(DATEDIFF(start_date, ?))", [$today])
                    ->first();
            }

            if (!$semester) {
                return response()->json(['error' => 'No semester found'], 404);
            }

            $semesterId = $semester->id;
        }

        // Lấy danh sách lessons theo teacher_code và semester_id
        $lessons = Lesson::with([
            'teacherSubject.teacher.user',
            'teacherSubject.subject',
            'room'
        ])
            ->where('semester_id', $semesterId)
            ->whereHas('teacherSubject', function ($query) use ($teacherCode) {
                $query->where('teacher_code', $teacherCode);
            })
            ->get()
            ->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => $lesson->teacherSubject->subject->name ?? '',
                    'subject' => $lesson->teacherSubject->subject,
                    'teacher' => [
                        'code' => $lesson->teacherSubject->teacher->code,
                        'status' => $lesson->teacherSubject->teacher->status,
                        'user_id' => $lesson->teacherSubject->teacher->user_id,
                        'faculty_id' => $lesson->teacherSubject->teacher->faculty_id,
                        'user' => $lesson->teacherSubject->teacher->user,
                    ],
                    'allDay' => false,
                    'startDate' => $lesson->start_date,
                    'endDate' => $lesson->end_date,
                    'startTime' => $lesson->start_time,
                    'endTime' => $lesson->end_time,
                    'room' => $lesson->room->name ?? null,
                    'repeat' => 'weekly',
                    'dayOfWeek' => $lesson->day_of_week,
                    'file_path' => $lesson->teacherSubject->subject->file_path,
                ];
            });

        return response()->json($lessons);
    }

    public function getLessonsNotEnterendByTeacher(Request $request)
    {
        $teacherCode = $request->input('teacher_code');
        $semesterId = $request->input('semester_id');

        if (!$teacherCode || !$semesterId) {
            return response()->json(['error' => 'teacher_code and semester_id are required'], 422);
        }

        $lessons = Lesson::with([
            'teacherSubject.teacher.user',
            'teacherSubject.subject',
            'room',
            'semester.academicYear'
        ])
            ->where('semester_id', $semesterId)
            ->whereHas('teacherSubject', function ($query) use ($teacherCode) {
                $query->where('teacher_code', $teacherCode);
            })
            ->where('grade_status', 'not_entered')->orWhere('grade_status', 'pending')
            ->get();

        return response()->json($lessons);
    }
}
