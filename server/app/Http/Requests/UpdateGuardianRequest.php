<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // hoặc bạn thêm logic phân quyền nếu cần
    }

    public function rules(): array
    {
        $rules = [
            'student_code' => ['sometimes', 'string', 'size:10', 'exists:students,code'],
        ];

        if ($this->isMethod('POST')) {
            $rules['user_id'][] = 'unique:parents,user_id';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'student_code.size' => 'Mã sinh viên phải đúng 10 ký tự.',
            'student_code.exists' => 'Sinh viên không tồn tại.',
        ];
    }

    public function attributes(): array
    {
        return [
            'user_id' => 'người dùng',
            'student_code' => 'mã sinh viên',
        ];
    }
}
