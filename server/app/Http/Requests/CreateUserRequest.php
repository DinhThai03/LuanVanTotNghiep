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
            'username'        => 'required|string|max:50|unique:users,username',
            'password'        => 'required|string|min:6|max:100',
            'role'            => 'required|in:admin,teacher,student,parent',
            'email'           => 'required|email|max:100|unique:users,email',
            'date_of_birth'   => 'required|date',
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'sex'             => 'required|boolean',
            'address'         => 'required|string|max:150',
            'phone'           => 'required|string|max:15',
            'identity_number' => 'nullable|string|max:20|unique:users,identity_number',
            'issued_date'     => 'nullable|date',
            'issued_place'    => 'nullable|string|max:100',
            'ethnicity'       => 'nullable|string|max:50',
            'religion'        => 'nullable|string|max:50',
            'is_active'       => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required'        => 'Tên đăng nhập là bắt buộc.',
            'username.unique'          => 'Tên đăng nhập đã tồn tại.',
            'username.max'             => 'Tên đăng nhập không được vượt quá 50 ký tự.',

            'password.required'        => 'Mật khẩu là bắt buộc.',
            'password.min'             => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.max'             => 'Mật khẩu không được vượt quá 100 ký tự.',

            'role.required'            => 'Vai trò là bắt buộc.',
            'role.in'                  => 'Vai trò không hợp lệ.',

            'email.required'           => 'Email là bắt buộc.',
            'email.email'              => 'Email không đúng định dạng.',
            'email.unique'             => 'Email đã tồn tại.',
            'email.max'                => 'Email không được vượt quá 100 ký tự.',

            'date_of_birth.required'   => 'Ngày sinh là bắt buộc.',
            'date_of_birth.date'       => 'Ngày sinh không hợp lệ.',

            'first_name.required'      => 'Tên là bắt buộc.',
            'first_name.max'           => 'Tên không được vượt quá 100 ký tự.',

            'last_name.required'       => 'Họ là bắt buộc.',
            'last_name.max'            => 'Họ không được vượt quá 100 ký tự.',

            'sex.required'             => 'Giới tính là bắt buộc.',
            'sex.boolean'              => 'Giới tính không hợp lệ.',

            'address.required'         => 'Địa chỉ là bắt buộc.',
            'address.max'              => 'Địa chỉ không được vượt quá 150 ký tự.',

            'phone.required'           => 'Số điện thoại là bắt buộc.',
            'phone.max'                => 'Số điện thoại không được vượt quá 15 ký tự.',

            'identity_number.max'      => 'Số căn cước không được vượt quá 20 ký tự.',
            'identity_number.unique'   => 'Số căn cước đã tồn tại.',

            'issued_date.date'         => 'Ngày cấp không hợp lệ.',

            'issued_place.max'         => 'Nơi cấp không được vượt quá 100 ký tự.',

            'ethnicity.max'            => 'Dân tộc không được vượt quá 50 ký tự.',

            'religion.max'             => 'Tôn giáo không được vượt quá 50 ký tự.',

            'is_active.boolean'        => 'Trạng thái hoạt động không hợp lệ.',
        ];
    }

    public function attributes(): array
    {
        return [
            'username'        => 'tên đăng nhập',
            'password'        => 'mật khẩu',
            'role'            => 'vai trò',
            'email'           => 'địa chỉ email',
            'date_of_birth'   => 'ngày sinh',
            'first_name'      => 'tên',
            'last_name'       => 'họ',
            'sex'             => 'giới tính',
            'address'         => 'địa chỉ',
            'phone'           => 'số điện thoại',
            'identity_number' => 'số căn cước',
            'issued_date'     => 'ngày cấp',
            'issued_place'    => 'nơi cấp',
            'ethnicity'       => 'dân tộc',
            'religion'        => 'tôn giáo',
            'is_active'       => 'trạng thái hoạt động',
        ];
    }
}
