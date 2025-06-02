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
            'class_id' => ['required', 'integer', 'exists:school_classes,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'class_id.required' => 'Lớp học là bắt buộc.',
            'class_id.exists' => 'Lớp học không tồn tại.',
        ];
    }
}
