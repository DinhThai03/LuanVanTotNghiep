<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFacultySubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => ['sometimes', 'integer', 'exists:subjects,id'],
            'faculty_id' => ['sometimes', 'integer', 'exists:faculties,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.exists' => 'Môn học không tồn tại.',
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
