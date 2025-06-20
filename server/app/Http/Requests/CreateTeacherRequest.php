<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Thêm logic phân quyền nếu cần
    }

    public function rules(): array
    {
        $rules = [
            'code' => ['required', 'string', 'size:10'],
            'user_id' => ['integer', 'exists:users,id'],
        ];

        if ($this->isMethod('POST')) {
            $rules['code'][] = 'unique:teachers,code';
            $rules['user_id'][] = 'unique:teachers,user_id';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Mã giáo viên là bắt buộc.',
            'code.size' => 'Mã giáo viên phải đúng 10 ký tự.',
            'code.unique' => 'Mã giáo viên đã tồn tại.',
            'user_id.integer' => 'ID người dùng không hợp lệ.',
            'user_id.exists' => 'Người dùng không tồn tại.',
            'user_id.unique' => 'Người dùng này đã là giáo viên.',
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
