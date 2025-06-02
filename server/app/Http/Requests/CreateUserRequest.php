<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username'      => 'required|string|max:50|unique:users,username',
            'password'      => 'required|string|min:6|max:100',
            'role'          => 'required|in:admin,teacher,student,parent',
            'email'         => 'required|email|max:100|unique:users,email',
            'date_of_birth' => 'required|date',
            'full_name'     => 'required|string|max:100',
            'address'       => 'required|string|max:150',
            'phone'         => 'required|string|max:15',
            'is_active'     => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Tên đăng nhập là bắt buộc.',
            'username.unique'   => 'Tên đăng nhập đã tồn tại.',
            'username.max'      => 'Tên đăng nhập không được vượt quá 50 ký tự.',

            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.min'      => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.max'      => 'Mật khẩu không được vượt quá 100 ký tự.',

            'role.required'     => 'Vai trò là bắt buộc.',
            'role.in'           => 'Vai trò không hợp lệ.',

            'email.required'    => 'Email là bắt buộc.',
            'email.email'       => 'Email không đúng định dạng.',
            'email.unique'      => 'Email đã tồn tại.',
            'email.max'         => 'Email không được vượt quá 100 ký tự.',

            'date_of_birth.required' => 'Ngày sinh là bắt buộc.',
            'date_of_birth.date'     => 'Ngày sinh không hợp lệ.',

            'full_name.required' => 'Họ và tên là bắt buộc.',
            'full_name.max'      => 'Họ và tên không được vượt quá 100 ký tự.',

            'address.required'   => 'Địa chỉ là bắt buộc.',
            'address.max'        => 'Địa chỉ không được vượt quá 150 ký tự.',

            'phone.required'     => 'Số điện thoại là bắt buộc.',
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
