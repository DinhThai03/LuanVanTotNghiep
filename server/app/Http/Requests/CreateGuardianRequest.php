<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // hoặc bạn thêm logic phân quyền nếu cần
    }

    public function rules(): array
    {
        $rules = [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'student_code' => ['required', 'string', 'size:10', 'exists:students,code'],
        ];

        if ($this->isMethod('POST')) {
            $rules['user_id'][] = 'unique:parents,user_id';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'ID người dùng là bắt buộc.',
            'user_id.integer' => 'ID người dùng không hợp lệ.',
            'user_id.exists' => 'Người dùng không tồn tại.',
            'user_id.unique' => 'Người dùng này đã tồn tại trong bảng phụ huynh.',
            'student_code.required' => 'Mã sinh viên là bắt buộc.',
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
