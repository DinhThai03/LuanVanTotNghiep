<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FacultyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên khoa là bắt buộc.',
            'name.max' => 'Tên khoa không được vượt quá 100 ký tự.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên khoa',
        ];
    }
}
