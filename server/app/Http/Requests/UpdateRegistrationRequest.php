<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'sometimes|in:pending,approved,canceled,completed',
            'student_code' => 'sometimes|exists:students,code|size:10',
            'lesson_id' => 'sometimes|exists:lessons,id',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái không hợp lệ.',

            'student_code.exists' => 'Mã sinh viên không tồn tại.',
            'student_code.size' => 'Mã sinh viên phải gồm đúng 10 ký tự.',

            'lesson_id.exists' => 'Buổi học không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => 'trạng thái',
            'student_code' => 'mã sinh viên',
            'lesson_id' => 'buổi học',
        ];
    }
}
