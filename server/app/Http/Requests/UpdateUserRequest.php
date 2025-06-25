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
        $userId = request()->route('user') ?? request()->get('user_id');
        return [
            'role'            => 'sometimes|in:admin,teacher,student,parent',
            'email'           => 'sometimes|email|max:100|unique:users,email,' . $userId,
            'date_of_birth'   => 'sometimes|date',
            'first_name'      => 'sometimes|string|max:100',
            'last_name'       => 'sometimes|string|max:100',
            'sex'             => 'sometimes|boolean',
            'address'         => 'sometimes|string|max:150',
            'phone'           => 'sometimes|string|max:15',
            'identity_number' => 'sometimes|string|max:20|unique:users,identity_number,' . $userId,
            'issued_date'     => 'sometimes|date|nullable',
            'issued_place'    => 'sometimes|string|max:100|nullable',
            'ethnicity'       => 'sometimes|string|max:50|nullable',
            'religion'        => 'sometimes|string|max:50|nullable',
            'is_active'       => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique'          => 'Tên đăng nhập đã tồn tại.',
            'username.max'             => 'Tên đăng nhập không được vượt quá 50 ký tự.',

            'password.min'             => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.max'             => 'Mật khẩu không được vượt quá 100 ký tự.',

            'role.in'                  => 'Vai trò không hợp lệ.',

            'email.email'              => 'Email không đúng định dạng.',
            'email.unique'             => 'Email đã tồn tại.',
            'email.max'                => 'Email không được vượt quá 100 ký tự.',

            'date_of_birth.date'       => 'Ngày sinh không hợp lệ.',
            'first_name.max'           => 'Tên không được vượt quá 100 ký tự.',
            'last_name.max'            => 'Họ không được vượt quá 100 ký tự.',
            'sex.boolean'              => 'Giới tính không hợp lệ.',
            'address.max'              => 'Địa chỉ không được vượt quá 150 ký tự.',
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
