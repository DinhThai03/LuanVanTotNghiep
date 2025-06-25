<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Thêm logic phân quyền nếu cần
    }

    public function rules(): array
    {
        $rules = [
            'status' => ['sometimes', 'string', 'in:Probation,Official,Resigned'],
            'faculty_id' => ['sometimes', 'integer', 'exists:faculties,id'],
            'subject_ids' => ['sometimes', 'array'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái không hợp lệ.',
            'faculty_id.exists' => 'Khoa không tồn tại.',
        ];
    }


    public function attributes(): array
    {
        return [
            'code' => 'mã giáo viên',
            'user_id' => 'người dùng',
        ];
    }
}
