<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSchoolClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'student_count' => ['sometimes', 'integer', 'min:0'],
            'faculty_id' => ['sometimes', 'integer', 'exists:faculties,id'],
            'cohort_id' => ['sometimes', 'integer', 'exists:cohorts,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Tên lớp không được vượt quá 100 ký tự.',
            'student_count.integer' => 'Sĩ số phải là số nguyên.',
            'student_count.min' => 'Sĩ số không được nhỏ hơn 0.',
            'faculty_id.exists' => 'Khoa không tồn tại.',
            'cohort_id.exists' => 'Niên khóa không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên lớp',
            'student_count' => 'sĩ số',
            'faculty_id' => 'khoa',
            'cohort_id' => 'Niên khóa',
        ];
    }
}
