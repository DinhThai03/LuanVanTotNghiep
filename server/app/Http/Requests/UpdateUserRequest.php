<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user'); // lấy ID từ URL route nếu có

        return [
            'username'      => 'sometimes|string|max:50|unique:users,username,' . $userId,
            'password'      => 'sometimes|string|min:6|max:100',
            'role'          => 'sometimes|in:admin,teacher,student,parent',
            'email'         => 'sometimes|email|max:100|unique:users,email,' . $userId,
            'date_of_birth' => 'sometimes|date',
            'full_name'     => 'sometimes|string|max:100',
            'address'       => 'sometimes|string|max:150',
            'phone'         => 'sometimes|string|max:15',
            'is_active'     => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique'   => 'Tên đăng nhập đã tồn tại.',
            'username.max'      => 'Tên đăng nhập không được vượt quá 50 ký tự.',

            'password.min'      => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.max'      => 'Mật khẩu không được vượt quá 100 ký tự.',

            'role.in'           => 'Vai trò không hợp lệ.',

            'email.email'       => 'Email không đúng định dạng.',
            'email.unique'      => 'Email đã tồn tại.',
            'email.max'         => 'Email không được vượt quá 100 ký tự.',

            'date_of_birth.date'     => 'Ngày sinh không hợp lệ.',

            'full_name.max'      => 'Họ và tên không được vượt quá 100 ký tự.',
            'address.max'        => 'Địa chỉ không được vượt quá 150 ký tự.',
            'phone.max'          => 'Số điện thoại không được vượt quá 15 ký tự.',
            'is_active.boolean'  => 'Trạng thái hoạt động không hợp lệ.',
        ];
    }

    public function attributes(): array
    {
        return [
            'username'      => 'tên đăng nhập',
            'password'      => 'mật khẩu',
            'role'          => 'vai trò',
            'email'         => 'địa chỉ email',
            'date_of_birth' => 'ngày sinh',
            'full_name'     => 'họ và tên',
            'address'       => 'địa chỉ',
            'phone'         => 'số điện thoại',
            'is_active'     => 'trạng thái hoạt động',
        ];
    }
}
