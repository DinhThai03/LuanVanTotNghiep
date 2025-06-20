<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username'        => 'required|string|max:50|unique:users,username',
            'password'        => 'required|string|min:6|max:100|confirmed',
            'role'            => 'required|in:admin,teacher,student,parent',
            'email'           => 'required|email|max:100|unique:users,email',
            'date_of_birth'   => 'required|date|before:today',
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'sex'             => 'required|boolean',
            'address'         => 'required|string|max:150',
            'phone'           => 'required|string|max:15|regex:/^[0-9+\-\s()]{9,15}$/',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Tên đăng nhập là bắt buộc.',
            'username.string'   => 'Tên đăng nhập phải là chuỗi.',
            'username.max'      => 'Tên đăng nhập không được vượt quá 50 ký tự.',
            'username.unique'   => 'Tên đăng nhập đã được sử dụng.',

            'password.required'  => 'Mật khẩu là bắt buộc.',
            'password.string'    => 'Mật khẩu phải là chuỗi.',
            'password.min'       => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.max'       => 'Mật khẩu không được vượt quá 100 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',

            'role.required' => 'Vai trò là bắt buộc.',
            'role.in'       => 'Vai trò không hợp lệ. Chỉ chấp nhận: admin, teacher, student, parent.',

            'email.required' => 'Email là bắt buộc.',
            'email.email'    => 'Email không hợp lệ.',
            'email.max'      => 'Email không được vượt quá 100 ký tự.',
            'email.unique'   => 'Email đã được sử dụng.',

            'date_of_birth.required' => 'Ngày sinh là bắt buộc.',
            'date_of_birth.date'     => 'Ngày sinh không hợp lệ.',
            'date_of_birth.before'   => 'Ngày sinh phải trước ngày hôm nay.',

            'first_name.required' => 'Tên là bắt buộc.',
            'first_name.string'   => 'Tên phải là chuỗi.',
            'first_name.max'      => 'Tên không được vượt quá 100 ký tự.',

            'last_name.required' => 'Họ là bắt buộc.',
            'last_name.string'   => 'Họ phải là chuỗi.',
            'last_name.max'      => 'Họ không được vượt quá 100 ký tự.',

            'sex.required' => 'Giới tính là bắt buộc.',
            'sex.boolean'  => 'Giới tính không hợp lệ.',

            'address.required' => 'Địa chỉ là bắt buộc.',
            'address.string'   => 'Địa chỉ phải là chuỗi.',
            'address.max'      => 'Địa chỉ không được vượt quá 150 ký tự.',

            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.string'   => 'Số điện thoại phải là chuỗi.',
            'phone.max'      => 'Số điện thoại không được vượt quá 15 ký tự.',
            'phone.regex'    => 'Số điện thoại không hợp lệ. Chỉ chứa số và ký tự + - ( ) khoảng trắng.',
        ];
    }
}
