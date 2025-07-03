<?php

namespace App\Http\Requests;

use App\Models\Lesson;
use App\Models\Registration;
use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;

class CreateRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,approved,canceled,completed',
            'student_code' => 'required|exists:students,code|size:10',
            'lesson_id' => 'required|exists:lessons,id',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái không hợp lệ.',

            'student_code.required' => 'Mã sinh viên là bắt buộc.',
            'student_code.exists' => 'Mã sinh viên không tồn tại.',
            'student_code.size' => 'Mã sinh viên phải gồm đúng 10 ký tự.',

            'lesson_id.required' => 'Buổi học là bắt buộc.',
            'lesson_id.exists' => 'Buổi học không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => 'trạng thái',
            'student_code' => 'mã sinh viên',
            'lesson_id' => 'buổi học',
        ];
    }


    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $student_code = $this->input('student_code');
            $lesson_id = $this->input('lesson_id');

            $lesson = Lesson::with('teacherSubject.subject', 'semester')->find($lesson_id);
            if (!$lesson) return;

            $subject_id = $lesson->teacherSubject->subject_id;
            $semester_id = $lesson->semester_id;

            // 1. Kiểm tra sinh viên đã đăng ký môn này trong kỳ chưa
            $existing = Registration::where('student_code', $student_code)
                ->whereHas('lesson.teacherSubject', function ($q) use ($subject_id) {
                    $q->where('subject_id', $subject_id);
                })
                ->whereHas('lesson', function ($q) use ($semester_id) {
                    $q->where('semester_id', $semester_id);
                })
                ->exists();

            if ($existing) {
                $validator->errors()->add('lesson_id', 'Sinh viên đã đăng ký môn học này trong học kỳ.');
            }

            // 2. Kiểm tra trùng lịch học (ngày, giờ)
            $conflict = Registration::where('student_code', $student_code)
                ->whereHas('lesson', function ($q) use ($lesson) {
                    $q->where('day_of_week', $lesson->day_of_week)
                        ->where(function ($query) use ($lesson) {
                            $query->where(function ($sub) use ($lesson) {
                                $sub->where('start_time', '<', $lesson->end_time)
                                    ->where('end_time', '>', $lesson->start_time);
                            });
                        });
                })
                ->exists();

            if ($conflict) {
                $validator->errors()->add('lesson_id', 'Buổi học bị trùng với môn khác đã đăng ký.');
            }
        });
    }
}
