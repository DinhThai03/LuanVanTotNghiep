<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có quyền thực hiện yêu cầu này không
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các quy tắc xác thực áp dụng cho yêu cầu đăng nhập
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ];
    }

    /**
     * Thông báo lỗi tùy chỉnh
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'username.required' => 'Tên đăng nhập là bắt buộc.',
            'username.string' => 'Tên đăng nhập phải là chuỗi.',
            'username.max' => 'Tên đăng nhập không được vượt quá 255 ký tự.',

            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.string' => 'Mật khẩu phải là chuỗi.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
        ];
    }

    /**
     * Đặt lại nhãn tên trường để hiển thị rõ ràng hơn trong thông báo lỗi (nếu muốn).
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'username' => 'tên đăng nhập',
            'password' => 'mật khẩu mới',
        ];
    }
}
