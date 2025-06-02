<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSemesterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after:start_date'],
            'academic_year_id' => ['sometimes', 'integer', 'exists:academic_years,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Tên học kỳ không được vượt quá 100 ký tự.',
            'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'academic_year_id.exists' => 'Năm học không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên học kỳ',
            'start_date' => 'ngày bắt đầu',
            'end_date' => 'ngày kết thúc',
            'academic_year_id' => 'năm học',
        ];
    }
}
