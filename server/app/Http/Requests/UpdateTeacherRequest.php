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
            'code' => ['sometimes', 'string', 'size:10'],
        ];

        if ($this->isMethod('POST')) {
            $rules['code'][] = 'unique:teachers,code';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.size' => 'Mã giáo viên phải đúng 10 ký tự.',
            'code.unique' => 'Mã giáo viên đã tồn tại.',
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
