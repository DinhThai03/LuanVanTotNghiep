<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSemesterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'academic_year_id' => ['required', 'integer', 'exists:academic_years,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên học kỳ là bắt buộc.',
            'name.max' => 'Tên học kỳ không được vượt quá 100 ký tự.',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'end_date.required' => 'Ngày kết thúc là bắt buộc.',
            'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'academic_year_id.required' => 'Năm học là bắt buộc.',
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
