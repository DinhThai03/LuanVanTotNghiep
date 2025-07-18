<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SemesterSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'semester_id' => ['required', 'integer', 'exists:semesters,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.required' => 'Môn học là bắt buộc.',
            'subject_id.exists' => 'Môn học không tồn tại.',
            'semester_id.required' => 'Học kỳ là bắt buộc.',
            'semester_id.exists' => 'Học kỳ không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'subject_id' => 'môn học',
            'semester_id' => 'học kỳ',
        ];
    }
}
