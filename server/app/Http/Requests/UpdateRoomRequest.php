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
            'room_type' => ['sometimes', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Tên phòng không được vượt quá 100 ký tự.',
            'size.integer' => 'Sức chứa phải là số nguyên.',
            'size.min' => 'Sức chứa tối thiểu là 10.',
            'room_type.boolean' => 'Loại phòng phải là chuỗi.',
            'is_active.required' => 'Trạng thái hoạt động phải là kiểu boolean',
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
