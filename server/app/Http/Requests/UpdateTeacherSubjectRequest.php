<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'teacher_code' => ['required', 'string', 'size:10', 'exists:teachers,code'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'teacher_code.required' => 'Mã giáo viên là bắt buộc.',
            'teacher_code.size' => 'Mã giáo viên phải có đúng 10 ký tự.',
            'teacher_code.exists' => 'Giáo viên không tồn tại.',
            'subject_id.required' => 'Môn học là bắt buộc.',
            'subject_id.exists' => 'Môn học không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'teacher_code' => 'mã giáo viên',
            'subject_id' => 'môn học',
        ];
    }
}
