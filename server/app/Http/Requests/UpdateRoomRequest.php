<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'size' => ['sometimes', 'integer', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Tên phòng không được vượt quá 100 ký tự.',
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
