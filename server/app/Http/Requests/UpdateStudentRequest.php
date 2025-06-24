<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'class_id' => ['sometimes', 'integer', 'exists:school_classes,id'],
            'place_of_birth' => ['sometimes', 'string', 'max:150'],
            'status' => ['sometimes', 'in:studying,paused,graduated'],
        ];
    }

    public function messages(): array
    {
        return [
            'class_id.required' => 'Lớp học là bắt buộc.',
            'class_id.exists' => 'Lớp học không tồn tại.',
            'place_of_birth.max' => 'Nơi sinh không được vượt quá 150 ký tự.',
            'status.in' => 'Trạng thái không hợp lệ (phải là: studying, paused hoặc graduated).',
        ];
    }

    public function attributes(): array
    {
        return [
            'class_id' => 'lớp học',
            'place_of_birth' => 'nơi sinh',
            'status' => 'trạng thái sinh viên',
        ];
    }
}
