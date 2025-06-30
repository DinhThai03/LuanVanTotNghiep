<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id'); // ID chính là user_id trong bảng parents

        return [
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'first_name' => ['sometimes', 'string', 'max:255'],
            'sex' => ['sometimes', 'in:0,1'],
            'date_of_birth' => ['sometimes', 'date'],
            'address' => ['sometimes', 'string', 'max:255'],
            'phone' => [
                'sometimes',
                'regex:/^[0-9]{10,11}$/',
                Rule::unique('users', 'phone')->ignore($userId),
            ],
            'identity_number' => [
                'sometimes',
                'regex:/^[0-9]{9}$|^[0-9]{12}$/',
                Rule::unique('users', 'identity_number')->ignore($userId),
            ],
            'issued_date' => ['sometimes', 'date'],
            'issued_place' => ['sometimes', 'string', 'max:255'],
            'ethnicity' => ['sometimes', 'string', 'max:100'],
            'religion' => ['sometimes', 'string', 'max:100'],

            'student_code' => [
                'sometimes',
                'string',
                'size:10',
                'exists:students,code',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'phone.regex' => 'Số điện thoại không hợp lệ.',
            'phone.unique' => 'Số điện thoại đã tồn tại.',
            'identity_number.regex' => 'CCCD phải gồm 9 hoặc 12 số.',
            'identity_number.unique' => 'CCCD đã tồn tại.',
            'sex.in' => 'Giới tính không hợp lệ.',
            'date_of_birth.date' => 'Ngày sinh không hợp lệ.',
            'issued_date.date' => 'Ngày cấp không hợp lệ.',
            'student_code.size' => 'Mã sinh viên phải đúng 10 ký tự.',
            'student_code.exists' => 'Sinh viên không tồn tại.',
        ];
    }


    public function attributes(): array
    {
        return [
            'email' => 'email',
            'last_name' => 'họ',
            'first_name' => 'tên',
            'sex' => 'giới tính',
            'date_of_birth' => 'ngày sinh',
            'address' => 'địa chỉ',
            'phone' => 'số điện thoại',
            'identity_number' => 'CCCD',
            'issued_date' => 'ngày cấp',
            'issued_place' => 'nơi cấp',
            'ethnicity' => 'dân tộc',
            'religion' => 'tôn giáo',
            'student_code' => 'mã sinh viên',
        ];
    }
}
