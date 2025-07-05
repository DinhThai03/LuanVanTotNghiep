<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateRegistrationRequest;
use App\Http\Requests\UpdateRegistrationRequest;
use App\Models\Lesson;
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
                'id' => $lesson->id,
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
                'file_path' => $subject->file_path,
            ];
        });

        return response()->json($mappedData);
    }

    public function store(CreateRegistrationRequest $request)
    {
        $registration = Registration::create($request->validated());

        // Tạo grade rỗng
        $registration->grade()->create([
            'process_score' => null,
            'midterm_score' => null,
            'final_score' => null,
        ]);

        // Nếu trạng thái là approved thì tạo học phí
        if ($registration->status === 'approved') {
            $lesson = $registration->lesson;
            $subject = $lesson->teacherSubject->subject;
            $semester = $lesson->semester;
            $academicYearId = $semester->academic_year_id;
            $subjectType = $subject->subject_type;

            // Lấy giá tín chỉ cho loại môn học trong năm học đó
            $creditPrice = \App\Models\CreditPrice::where([
                ['academic_year_id', '=', $academicYearId],
                ['subject_type', '=', $subjectType],
                ['is_active', '=', true],
            ])->first();

            if (!$creditPrice) {
                return response()->json([
                    'message' => 'Không tìm thấy đơn giá tín chỉ cho loại môn học này trong năm học.',
                ], 400);
            }

            $tuitionCredit = $subject->tuition_credit ?? $subject->credit;
            $amount = $tuitionCredit * $creditPrice->price_per_credit;

            $registration->tuitionFee()->create([
                'amount' => $amount,
                'paid_at' => null,
                'payment_method' => null,
                'payment_status' => 'unpaid',
                'transaction_id' => null,
            ]);
        }

        // Load các quan hệ liên quan
        $registration->load(
            'student.user',
            'lesson.room',
            'lesson.teacherSubject.teacher.user',
            'lesson.teacherSubject.subject',
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

        // Xóa grade nếu có
        $registration->grade()?->delete();

        // Xóa đăng ký
        $registration->delete();

        return response()->json(['message' => 'Xóa đăng ký thành công.']);
    }

    public function getStudentsByLesson($lesson_id)
    {
        $registrations = Registration::with('student.user', 'student.schoolClass')
            ->where('lesson_id', $lesson_id)
            ->get();

        $students = $registrations->map(function ($registration) {
            return $registration->student;
        });

        return response()->json([
            'lesson_id' => $lesson_id,
            'students' => $students,
        ]);
    }

    public function registerLessons(Request $request)
    {
        $request->validate([
            'student_code' => 'required|string|exists:students,code',
            'semester_id' => 'required|integer|exists:semesters,id',
            'selections' => 'required|array|min:1',
            'selections.*' => 'integer|exists:lessons,id',
        ]);

        $studentCode = $request->student_code;
        $semesterId = $request->semester_id;
        $selections = $request->selections;

        $success = [];
        $failed = [];

        foreach ($selections as $subjectCode => $lessonId) {
            $lesson = Lesson::with(['room', 'teacherSubject.subject'])->find($lessonId);

            if (!$lesson) {
                $failed[] = [
                    'lesson_id' => $lessonId,
                    'subject_code' => $subjectCode,
                    'reason' => 'Bài giảng không tồn tại',
                ];
                continue;
            }
            $subject = optional($lesson->teacherSubject->subject);
            $subjectId = $subject->id ?? null;

            if ($subject->code !== $subjectCode || $lesson->semester_id != $semesterId) {
                $failed[] = [
                    'lesson_id' => $lessonId,
                    'subject_code' => $subjectCode,
                    'reason' => 'Bài giảng không khớp với môn học hoặc học kỳ',
                ];
                continue;
            }

            $existingRegistration = Registration::where('student_code', $studentCode)
                ->whereHas('lesson', function ($query) use ($subjectId, $semesterId) {
                    $query->where('semester_id', $semesterId)
                        ->whereHas('teacherSubject', function ($q) use ($subjectId) {
                            $q->where('subject_id', $subjectId);
                        });
                })->first();
            if ($existingRegistration) {
                $existingRegistration->delete();
            }

            // Kiểm tra phòng còn chỗ
            $currentCount = $lesson->registrations()->count();
            $roomSize = $lesson->room->size ?? 0;

            if ($currentCount >= $roomSize) {
                $failed[] = [
                    'lesson_id' => $lessonId,
                    'subject_code' => $subjectCode,
                    'reason' => 'Phòng đã đầy',
                ];
                continue;
            }

            // Đăng ký mới
            Registration::create([
                'student_code' => $studentCode,
                'lesson_id' => $lessonId,
                'status' => 'approved',
            ]);

            $success[] = [
                'lesson_id' => $lessonId,
                'subject_code' => $subjectCode,
                'subject_name' => $subject->name ?? 'Không xác định',
            ];
        }

        return response()->json([
            'message' => 'Kết quả đăng ký',
            'registered' => $success,
            'skipped' => $failed,
        ]);
    }
}
