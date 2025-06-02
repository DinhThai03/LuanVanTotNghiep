<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có quyền thực hiện yêu cầu này không.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các quy tắc xác thực áp dụng cho yêu cầu.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'admin_level' => 'required|integer|min:1',
        ];

        if ($this->isMethod('POST')) {
            $rules['user_id'][] = 'unique:admins,user_id';
        }

        return $rules;
    }

    /**
     * Thông báo lỗi tùy chỉnh.
     */
    public function messages(): array
    {
        return [
            'admin_level.required' => 'Vui lòng nhập cấp độ quản trị.',
            'admin_level.integer' => 'Cấp độ quản trị phải là số nguyên.',
            'admin_level.min' => 'Cấp độ quản trị phải lớn hơn 0.',
        ];
    }

    /**
     * Gán nhãn hiển thị đẹp hơn cho các trường (tùy chọn).
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'người dùng',
            'admin_level' => 'cấp độ quản trị',
        ];
    }
}
