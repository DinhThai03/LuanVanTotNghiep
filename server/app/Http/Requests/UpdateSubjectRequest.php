<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'credit' => ['sometimes', 'integer', 'min:1'],
            'tuition_credit' => ['sometimes', 'integer', 'min:1'],
            'midterm_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'process_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'final_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'year' => ['sometimes', 'integer', 'min:1', 'max:4'],
            'subject_type' => ['sometimes', 'in:LT,TH'],
            'is_active' => ['sometimes'],
            'faculty_ids' => ['sometimes', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_type.in' => 'Loại môn học phải là LT hoặc TH.',
            'year.integer' => 'Năm phải là số nguyên.',
            'year.min' => 'Năm không hợp lệ.',
            'year.max' => 'Năm không hợp lệ.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên môn học',
            'credit' => 'tín chỉ',
            'tuition_credit' => 'tín chỉ học phí',
            'midterm_percent' => 'tỷ lệ giữa kỳ',
            'process_percent' => 'tỷ lệ quá trình',
            'final_percent' => 'tỷ lệ cuối kỳ',
            'subject_type' => 'loại môn học',
        ];
    }
}
