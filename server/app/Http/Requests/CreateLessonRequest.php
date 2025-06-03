<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'day_of_week' => ['required', 'integer', 'between:1,7'],
            'is_active' => ['required', 'boolean'],
            'teacher_subject_id' => ['required', 'exists:teacher_subjects,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'end_date.required' => 'Ngày kết thúc là bắt buộc.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'day_of_week.between' => 'Thứ phải nằm trong khoảng từ 1 đến 7.',
            'teacher_subject_id.exists' => 'Môn học của giáo viên không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'start_date' => 'ngày bắt đầu',
            'end_date' => 'ngày kết thúc',
            'day_of_week' => 'thứ trong tuần',
            'is_active' => 'trạng thái',
            'teacher_subject_id' => 'môn học của giáo viên',
        ];
    }
}
