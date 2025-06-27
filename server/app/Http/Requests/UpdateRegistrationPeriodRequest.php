<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRegistrationPeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'faculty_id'     => ['sometimes', 'integer', 'exists:faculties,id'],
            'semester_id'    => ['sometimes', 'integer', 'exists:semesters,id'],
            'round1_start'   => ['sometimes', 'date'],
            'round1_end'     => ['sometimes', 'date', 'after_or_equal:round1_start'],
            'round2_start'   => ['nullable', 'date', 'after_or_equal:round1_end'],
            'round2_end'     => ['nullable', 'date', 'after_or_equal:round2_start'],
        ];
    }

    public function messages(): array
    {
        return [
            'faculty_id.exists' => 'Khoa không tồn tại.',
            'semester_id.exists' => 'Học kỳ không tồn tại.',
            'round1_end.after_or_equal' => 'Thời gian kết thúc đợt 1 phải sau hoặc bằng thời gian bắt đầu.',
            'round2_start.after_or_equal' => 'Thời gian bắt đầu đợt 2 phải sau hoặc bằng thời gian kết thúc đợt 1.',
            'round2_end.after_or_equal' => 'Thời gian kết thúc đợt 2 phải sau hoặc bằng thời gian bắt đầu đợt 2.',
        ];
    }

    public function attributes(): array
    {
        return [
            'faculty_id' => 'khoa',
            'semester_id' => 'học kỳ',
            'round1_start' => 'thời gian bắt đầu đợt 1',
            'round1_end' => 'thời gian kết thúc đợt 1',
            'round2_start' => 'thời gian bắt đầu đợt 2',
            'round2_end' => 'thời gian kết thúc đợt 2',
        ];
    }
}
