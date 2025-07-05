<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateTuitionFeeRequest;
use App\Http\Requests\UpdateTuitionFeeRequest;
use App\Models\Semester;
use App\Models\TuitionFee;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TuitionFeeController extends Controller
{
    public function index()
    {
        return response()->json(TuitionFee::all());
    }

    public function store(CreateTuitionFeeRequest $request)
    {
        $tuitionFee = TuitionFee::create($request->validated());

        return response()->json([
            'message' => 'Đã tạo học phí thành công.',
            'data' => $tuitionFee,
        ], 201);
    }

    public function getBySemester($studentCode, Request $request)
    {
        $semesterId = $request->query('semester_id');

        // Ưu tiên lấy học kỳ theo ID nếu có
        if ($semesterId) {
            $semester = Semester::find($semesterId);
        }

        // Nếu không có ID, tìm học kỳ hiện tại
        if (!isset($semester)) {
            $semester = Semester::where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->orderBy('start_date', 'asc')
                ->first();
        }

        // Nếu vẫn chưa có, tìm học kỳ sắp tới
        if (!$semester) {
            $semester = Semester::where('start_date', '>', now())
                ->orderBy('start_date', 'asc')
                ->first();
        }

        if (!$semester) {
            return response()->json(['message' => 'Không tìm thấy học kỳ phù hợp.'], 404);
        }

        // Lấy học phí theo student_code và semester_id
        $tuitionFees = TuitionFee::whereHas('registration', function ($query) use ($studentCode, $semester) {
            $query->where('student_code', $studentCode)
                ->whereHas('lesson', function ($q) use ($semester) {
                    $q->where('semester_id', $semester->id);
                });
        })->with(['registration.lesson.teacherSubject.subject'])
            ->get();

        return response()->json([
            'semester' => $semester->name ?? null,
            'tuition_fees' => $tuitionFees
        ]);
    }

    public function show($id)
    {
        $tuitionFee = TuitionFee::find($id);

        if (!$tuitionFee) {
            return response()->json(['message' => 'Không tìm thấy bản ghi học phí.'], 404);
        }

        return response()->json($tuitionFee);
    }

    public function update(UpdateTuitionFeeRequest $request, $id)
    {
        $tuitionFee = TuitionFee::find($id);

        if (!$tuitionFee) {
            return response()->json(['message' => 'Không tìm thấy bản ghi học phí.'], 404);
        }

        $tuitionFee->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật học phí thành công.',
            'data' => $tuitionFee,
        ]);
    }

    public function destroy($id)
    {
        $tuitionFee = TuitionFee::find($id);

        if (!$tuitionFee) {
            return response()->json(['message' => 'Không tìm thấy bản ghi học phí.'], 404);
        }

        $tuitionFee->delete();

        return response()->json(['message' => 'Xóa học phí thành công.']);
    }

    public function getTuitionSummaryBySemester(Request $request)
    {
        $semesterId = $request->get('semester_id');
        $stt = 0;

        if (!$semesterId) {
            return response()->json(['error' => 'Thiếu semester_id'], 400);
        }

        $semester = Semester::with('academicYear')->find($semesterId);
        if (!$semester) {
            return response()->json(['error' => 'Học kỳ không tồn tại'], 404);
        }

        $query = TuitionFee::with([
            'registration.student.user',
            'registration.lesson.semester',
            'registration.lesson.teacherSubject.subject.faculties',
            'registration.student.schoolClass'
        ])->whereHas('registration.lesson', function ($q) use ($semesterId) {
            $q->where('semester_id', $semesterId);
        });

        if ($request->has('faculty_id')) {
            $query->whereHas('registration.lesson.teacherSubject.subject.faculties', function ($q) use ($request) {
                $q->where('faculties.id', $request->get('faculty_id'));
            });
        }

        if ($request->has('class_id')) {
            $query->whereHas('registration.student', function ($q) use ($request) {
                $q->where('class_id', $request->get('class_id'));
            });
        }

        $tuitionFees = $query->get();

        $grouped = $tuitionFees->groupBy('registration.student_code');

        $semesterData = [
            'semester' => [
                'id' => $semester->id,
                'name' => $semester->name,
                'start_date' => $semester->start_date,
                'end_date' => $semester->end_date,
            ],
            'students' => []
        ];

        foreach ($grouped as $studentCode => $payments) {
            $registration = $payments->first()->registration;
            $student = $registration->student;
            $user = $student->user;

            // Tổng tiền: tất cả dòng amount (không phân biệt status)
            $totalAmount = $payments->sum(fn($p) => floatval($p->amount));

            // Đã thanh toán: chỉ những dòng có status = 'success'
            $paidAmount = $payments->where('payment_status', 'success')->sum(fn($p) => floatval($p->amount));

            // Chưa thanh toán: phần còn lại
            $remainingAmount = max($totalAmount - $paidAmount, 0);

            // Lấy danh sách khoa
            $faculties = collect();
            foreach ($payments as $payment) {
                $faculties = $faculties->merge(
                    optional($payment->registration->lesson->teacherSubject->subject)?->faculties ?? []
                );
            }
            $faculties = $faculties->unique('id')->values();

            $semesterData['students'][] = [
                'stt' => ++$stt,
                'student' => [
                    'code' => $student->code,
                    'full_name' => $user->last_name . ' ' . $user->first_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
                'faculties' => $faculties->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name
                ]),
                'class' => $student->schoolClass?->name,
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remainingAmount,
                'payment_details' => $payments->map(fn($p) => [
                    'id' => $p->id,
                    'amount' => $p->amount,
                    'paid_at' => $p->paid_at,
                    'payment_method' => $p->payment_method,
                    'payment_status' => $p->payment_status,
                    'transaction_id' => $p->transaction_id
                ])
            ];
        }

        return response()->json($semesterData);
    }

    public function payByCash(Request $request)
    {
        $tuitionFeeIds = $request->input('tuition_fee_ids');

        if (!is_array($tuitionFeeIds) || empty($tuitionFeeIds)) {
            return response()->json(['error' => 'Danh sách học phí không hợp lệ'], 400);
        }

        $now = Carbon::now();
        $count = 0;

        foreach ($tuitionFeeIds as $id) {
            $fee = TuitionFee::find($id);
            if ($fee) {
                $fee->payment_status = 'success';
                $fee->payment_method = 'cash';
                $fee->paid_at = $now;
                $fee->transaction_id = 'CASH-' . $now->format('YmdHis');
                $fee->save();
                $count++;
            }
        }

        return response()->json([
            'message' => "Đã cập nhật {$count} khoản học phí là đã thanh toán bằng tiền mặt.",
        ]);
    }
}
