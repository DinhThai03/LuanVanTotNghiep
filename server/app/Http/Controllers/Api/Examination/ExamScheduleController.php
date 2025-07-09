<?php

namespace App\Http\Controllers\Api\Examination;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateExamScheduleRequest;
use App\Http\Requests\StoreExamScheduleRequest;
use App\Http\Requests\UpdateExamScheduleRequest;
use App\Models\ExamSchedule;
use Illuminate\Http\Request;

class ExamScheduleController extends Controller
{
    /**
     * Hiển thị danh sách lịch thi.
     */
    public function index()
    {
        $examSchedules = ExamSchedule::all();
        return response()->json($examSchedules);
    }

    /**
     * Tạo mới một lịch thi.
     */
    public function store(CreateExamScheduleRequest $request)
    {
        $examSchedule = ExamSchedule::create($request->validated());
        return response()->json([
            'message' => 'Tạo lịch thi thành công.',
            'data' => $examSchedule,
        ], 201);
    }

    /**
     * Hiển thị chi tiết một lịch thi.
     */
    public function show($id)
    {
        $examSchedule = ExamSchedule::find($id);

        if (!$examSchedule) {
            return response()->json(['message' => 'Không tìm thấy lịch thi.'], 404);
        }

        return response()->json($examSchedule);
    }

    /**
     * Cập nhật lịch thi.
     */
    public function update(UpdateExamScheduleRequest $request, $id)
    {
        $examSchedule = ExamSchedule::find($id);

        if (!$examSchedule) {
            return response()->json(['message' => 'Không tìm thấy lịch thi.'], 404);
        }

        $validated = $request->validated();

        $examSchedule->update($validated);

        return response()->json([
            'message' => 'Cập nhật lịch thi thành công.',
            'data' => $examSchedule,
        ]);
    }

    /**
     * Xóa lịch thi.
     */
    public function destroy($id)
    {
        $examSchedule = ExamSchedule::find($id);

        if (!$examSchedule) {
            return response()->json(['message' => 'Không tìm thấy lịch thi.'], 404);
        }

        $examSchedule->delete();

        return response()->json(['message' => 'Xóa lịch thi thành công.']);
    }

    public function getStudentExamSchedules($studentCode, $semesterId)
    {
        $examSchedules = ExamSchedule::with([
            'semesterSubject.subject',
            'examClassRooms.room',
            'examClassRooms.class',
        ])
            ->whereHas('semesterSubject', function ($query) use ($semesterId, $studentCode) {
                $query->where('semester_id', $semesterId)
                    ->whereHas('subject.teacherSubjects.lessons.registrations', function ($subQuery) use ($studentCode) {
                        $subQuery->where('student_code', $studentCode);
                    });
            })
            ->where('is_active', true)
            ->get();

        $result = $examSchedules->map(function ($schedule) {
            return [
                'subject_name' => $schedule->semesterSubject->subject->name ?? '',
                'exam_date'    => $schedule->exam_date,
                'exam_time'    => $schedule->exam_time,
                'duration'     => $schedule->duration,
                'rooms'        => $schedule->examClassRooms->map(function ($ecr) {
                    return [
                        'room'       => $ecr->room->name ?? '',
                        'class'      => $ecr->class->name ?? '',
                        'start_seat' => $ecr->start_seat,
                        'end_seat'   => $ecr->end_seat,
                    ];
                }),
            ];
        });

        return response()->json([
            'student_code' => $studentCode,
            'semester_id' => $semesterId,
            'exam_schedules' => $result,
        ]);
    }
}
