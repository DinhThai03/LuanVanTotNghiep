<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSchoolClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'student_count' => ['required', 'integer', 'min:0'],
            'faculty_id' => ['required', 'integer', 'exists:faculties,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên lớp là bắt buộc.',
            'name.max' => 'Tên lớp không được vượt quá 100 ký tự.',
            'student_count.required' => 'Sĩ số là bắt buộc.',
            'student_count.integer' => 'Sĩ số phải là số nguyên.',
            'student_count.min' => 'Sĩ số không được nhỏ hơn 0.',
            'faculty_id.required' => 'Khoa là bắt buộc.',
            'faculty_id.exists' => 'Khoa không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên lớp',
            'student_count' => 'sĩ số',
            'faculty_id' => 'khoa',
        ];
    }
}
