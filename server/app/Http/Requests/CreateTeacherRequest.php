<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTeacherRequest extends FormRequest
{
    public function rules(): array
    {
        $rules = [
            'code' => ['sometimes', 'string', 'size:10', 'unique:teachers,code'],
            'status' => ['sometimes', 'string'],
        ];

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
