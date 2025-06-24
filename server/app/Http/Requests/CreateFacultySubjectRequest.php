<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateFacultySubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'faculty_id' => ['required', 'integer', 'exists:faculties,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.required' => 'Môn học là bắt buộc.',
            'subject_id.exists' => 'Môn học không tồn tại.',
            'faculty_id.required' => 'Khoa là bắt buộc.',
            'faculty_id.exists' => 'Khoa không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'year' => 'năm',
            'subject_id' => 'môn học',
            'faculty_id' => 'khoa',
        ];
    }
}
