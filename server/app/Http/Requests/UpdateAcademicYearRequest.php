<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAcademicYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Thêm phân quyền nếu cần
    }

    public function rules(): array
    {
        return [
            'start_year' => ['sometimes', 'integer', 'min:2000'],
            'end_year' => ['sometimes', 'integer', 'gt:start_year'],
            'name' => ['sometimes', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'start_year.integer' => 'Năm bắt đầu phải là số nguyên.',
            'start_year.min' => 'Năm bắt đầu phải lớn hơn hoặc bằng 2000.',
            'end_year.integer' => 'Năm kết thúc phải là số nguyên.',
            'end_year.gt' => 'Năm kết thúc phải lớn hơn năm bắt đầu.',
            'name.max' => 'Tên năm học không được vượt quá 100 ký tự.',
        ];
    }

    public function attributes(): array
    {
        return [
            'start_year' => 'năm bắt đầu',
            'end_year' => 'năm kết thúc',
            'name' => 'tên năm học',
        ];
    }
}
