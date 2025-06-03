<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'day_of_week' => ['sometimes', 'integer', 'between:1,7'],
            'is_active' => ['sometimes', 'boolean'],
            'teacher_subject_id' => ['sometimes', 'exists:teacher_subjects,id'],
        ];
    }

    public function messages(): array
    {
        return [
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
