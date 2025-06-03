<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'size' => ['required', 'integer', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên phòng là bắt buộc.',
            'name.max' => 'Tên phòng không được vượt quá 100 ký tự.',
            'size.required' => 'Sức chứa là bắt buộc.',
            'size.integer' => 'Sức chứa phải là số nguyên.',
            'size.min' => 'Sức chứa tối thiểu là 10.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'tên phòng',
            'size' => 'sức chứa',
        ];
    }
}
