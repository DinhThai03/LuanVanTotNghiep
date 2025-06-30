<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateGuardianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'sex' => ['required', 'in:0,1'],
            'date_of_birth' => ['required', 'date'],
            'address' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'regex:/^[0-9]{10,11}$/'],
            'identity_number' => ['required', 'regex:/^[0-9]{9}$|^[0-9]{12}$/'],
            'issued_date' => ['required', 'date'],
            'issued_place' => ['required', 'string', 'max:255'],
            'ethnicity' => ['required', 'string', 'max:100'],
            'religion' => ['required', 'string', 'max:100'],

            'student.user_id' => ['required', 'integer', 'exists:users,id', 'unique:parents,user_id'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',

            'last_name.required' => 'Họ là bắt buộc.',
            'first_name.required' => 'Tên là bắt buộc.',
            'sex.in' => 'Giới tính không hợp lệ.',
            'date_of_birth.date' => 'Ngày sinh không hợp lệ.',
            'phone.regex' => 'Số điện thoại không hợp lệ.',
            'identity_number.regex' => 'CCCD phải gồm 9 hoặc 12 số.',
            'issued_date.date' => 'Ngày cấp không hợp lệ.',
            // ...

            'student.user_id.required' => 'Người dùng là bắt buộc.',
            'student.user_id.exists' => 'Người dùng không tồn tại.',
            'student.user_id.unique' => 'Người dùng này đã là phụ huynh.',
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

            'student.user_id' => 'người dùng sinh viên',
        ];
    }
}
