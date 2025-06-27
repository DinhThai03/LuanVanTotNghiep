<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,approved,canceled,completed',
            'student_code' => 'required|exists:students,code|size:10',
            'lesson_id' => 'required|exists:lesson_rooms,id',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Trạng thái là bắt buộc.',
            'status.in' => 'Trạng thái không hợp lệ.',

            'student_code.required' => 'Mã sinh viên là bắt buộc.',
            'student_code.exists' => 'Mã sinh viên không tồn tại.',
            'student_code.size' => 'Mã sinh viên phải gồm đúng 10 ký tự.',

            'lesson_id.required' => 'Buổi học là bắt buộc.',
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
