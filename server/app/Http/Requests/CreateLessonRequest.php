<?php

namespace App\Http\Requests;

use App\Models\Lesson;
use Carbon\CarbonPeriod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CreateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'semester_id' => ['required', 'exists:semesters,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'day_of_week' => ['required', 'integer', 'between:1,7'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'room_id' => ['required', 'exists:rooms,id'],
            'is_active' => ['required', 'boolean'],
            'teacher_subject_id' => ['required', 'exists:teacher_subjects,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'semester_id.required' => 'Học kỳ là bắt buộc.',
            'semester_id.exists' => 'Học kỳ không tồn tại.',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'end_date.required' => 'Ngày kết thúc là bắt buộc.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'day_of_week.required' => 'Thứ trong tuần là bắt buộc.',
            'day_of_week.between' => 'Thứ phải nằm trong khoảng từ 1 đến 7.',
            'start_time.required' => 'Giờ bắt đầu là bắt buộc.',
            'start_time.date_format' => 'Giờ bắt đầu không đúng định dạng (H:i).',
            'end_time.required' => 'Giờ kết thúc là bắt buộc.',
            'end_time.date_format' => 'Giờ kết thúc không đúng định dạng (H:i).',
            'end_time.after' => 'Giờ kết thúc phải sau giờ bắt đầu.',
            'room_id.required' => 'Phòng học là bắt buộc.',
            'room_id.exists' => 'Phòng học không tồn tại.',
            'is_active.required' => 'Trạng thái là bắt buộc.',
            'is_active.boolean' => 'Trạng thái phải là true hoặc false.',
            'teacher_subject_id.required' => 'Môn học của giáo viên là bắt buộc.',
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
            if ($this->hasOverlap()) {
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

        $dates = collect(CarbonPeriod::create($startDate, $endDate))
            ->filter(fn($date) => $date->dayOfWeekIso == $dayOfWeek);

        foreach ($dates as $date) {
            $lessons = Lesson::where('room_id', $roomId)
                ->where('day_of_week', $dayOfWeek)
                ->whereRaw('? < end_time AND ? > start_time', [$startTime, $endTime])
                ->whereDate('start_date', '<=', $date->format('Y-m-d'))
                ->whereDate('end_date', '>=', $date->format('Y-m-d'))
                ->exists();

            if ($lessons) {
                return true;
            }
        }

        return false;
    }
}
