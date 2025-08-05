<?php

namespace App\Http\Requests;

use App\Models\Lesson;
use Carbon\CarbonPeriod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'semester_id' => ['sometimes', 'exists:semesters,id'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'day_of_week' => ['sometimes', 'integer', 'between:1,7'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'end_time' => ['sometimes', 'date_format:H:i', 'after:start_time'],
            'room_id' => ['sometimes', 'exists:rooms,id'],
            'is_active' => ['sometimes', 'boolean'],
            'teacher_subject_id' => ['sometimes', 'exists:teacher_subjects,id'],
            'grade_status' => ['sometimes', 'in:submitted,approved,rejected'],
        ];
    }

    public function messages(): array
    {
        return [
            'semester_id.exists' => 'Học kỳ không tồn tại.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'day_of_week.between' => 'Thứ phải nằm trong khoảng từ 1 đến 7.',
            'start_time.date_format' => 'Giờ bắt đầu không đúng định dạng (H:i).',
            'end_time.date_format' => 'Giờ kết thúc không đúng định dạng (H:i).',
            'end_time.after' => 'Giờ kết thúc phải sau giờ bắt đầu.',
            'room_id.exists' => 'Phòng học không tồn tại.',
            'teacher_subject_id.exists' => 'Môn học của giáo viên không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'semester_id' => 'học kỳ',
            'start_date' => 'ngày bắt đầu',
            'end_date' => 'ngày kết thúc',
            'day_of_week' => 'thứ trong tuần',
            'start_time' => 'giờ bắt đầu',
            'end_time' => 'giờ kết thúc',
            'room_id' => 'phòng học',
            'is_active' => 'trạng thái',
            'teacher_subject_id' => 'môn học của giáo viên',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function (Validator $validator) {
            if (
                $this->filled(['start_date', 'end_date', 'day_of_week', 'start_time', 'end_time', 'room_id']) &&
                $this->hasOverlap()
            ) {
                $validator->errors()->add('time_conflict', 'Phòng học đã có lớp khác vào thời gian này.');
            }
        });
    }

    protected function hasOverlap(): bool
    {
        $startDate = $this->input('start_date');
        $endDate = $this->input('end_date');
        $dayOfWeek = (int) $this->input('day_of_week');
        $startTime = date('H:i:s', strtotime($this->input('start_time')));
        $endTime = date('H:i:s', strtotime($this->input('end_time')));
        $roomId = $this->input('room_id');

        // Lấy ID từ route
        $lessonId = $this->route('lesson') ?? $this->route('id');
        if (is_object($lessonId)) {
            $lessonId = $lessonId->id;
        }

        if (!$startDate || !$endDate || !$dayOfWeek || !$startTime || !$endTime || !$roomId) {
            return false;
        }

        $dates = collect(CarbonPeriod::create($startDate, $endDate))
            ->filter(fn($date) => $date->dayOfWeekIso == $dayOfWeek);

        foreach ($dates as $date) {
            $conflict = Lesson::where('room_id', $roomId)
                ->where('day_of_week', $dayOfWeek)
                ->whereRaw('? < end_time AND ? > start_time', [$startTime, $endTime])
                ->whereDate('start_date', '<=', $date->format('Y-m-d'))
                ->whereDate('end_date', '>=', $date->format('Y-m-d'))
                ->when($lessonId, fn($q) => $q->where('id', '!=', $lessonId))
                ->exists();

            if ($conflict) {
                return true;
            }
        }

        return false;
    }
}
