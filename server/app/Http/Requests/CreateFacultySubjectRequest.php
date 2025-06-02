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
            'year' => ['required', 'integer', 'min:1', 'max:4'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'faculty_id' => ['required', 'integer', 'exists:faculties,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'year.required' => 'Năm là bắt buộc.',
            'year.integer' => 'Năm phải là số nguyên.',
            'year.min' => 'Năm không hợp lệ.',
            'year.max' => 'Năm không hợp lệ.',
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
