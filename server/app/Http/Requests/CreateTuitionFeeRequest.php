<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTuitionFeeRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có quyền thực hiện yêu cầu này không
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các quy tắc xác thực áp dụng cho yêu cầu lưu học phí
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'registration_id' => 'required|exists:registrations,id',
            'amount' => 'required|numeric|min:0',
            'paid_at' => 'required|date',
            'payment_method' => 'nullable|string|max:50',
            'payment_status' => 'nullable|in:pending,success,failed',
            'transaction_id' => 'nullable|string|max:100',
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
            'registration_id.required' => 'Mã đăng ký là bắt buộc.',
            'registration_id.exists' => 'Mã đăng ký không tồn tại.',

            'amount.required' => 'Số tiền là bắt buộc.',
            'amount.numeric' => 'Số tiền phải là số.',
            'amount.min' => 'Số tiền phải lớn hơn hoặc bằng 0.',

            'paid_at.required' => 'Thời gian thanh toán là bắt buộc.',
            'paid_at.date' => 'Thời gian thanh toán không hợp lệ.',

            'payment_method.string' => 'Phương thức thanh toán phải là chuỗi.',
            'payment_method.max' => 'Phương thức thanh toán không được vượt quá 50 ký tự.',

            'payment_status.in' => 'Trạng thái thanh toán không hợp lệ. (pending, success, failed)',

            'transaction_id.string' => 'Mã giao dịch phải là chuỗi.',
            'transaction_id.max' => 'Mã giao dịch không được vượt quá 100 ký tự.',
        ];
    }

    /**
     * Đặt lại nhãn tên trường để hiển thị rõ ràng hơn trong thông báo lỗi
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'registration_id' => 'mã đăng ký',
            'amount' => 'số tiền',
            'paid_at' => 'thời gian thanh toán',
            'payment_method' => 'phương thức thanh toán',
            'payment_status' => 'trạng thái thanh toán',
            'transaction_id' => 'mã giao dịch',
        ];
    }
}
