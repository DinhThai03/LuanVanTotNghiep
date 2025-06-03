<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCreditPriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_type' => 'sometimes|in:LT,TH',
            'price_per_credit' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'year' => 'sometimes|integer|min:2000|max:' . (date('Y') + 1),
        ];
    }

    public function messages(): array
    {
        return [
            'subject_type.in' => 'Loại môn học phải là LT (Lý thuyết) hoặc TH (Thực hành).',
            'price_per_credit.numeric' => 'Giá mỗi tín chỉ phải là số.',
            'price_per_credit.min' => 'Giá mỗi tín chỉ phải lớn hơn hoặc bằng 0.',
            'is_active.boolean' => 'Trạng thái phải là true hoặc false.',
            'year.integer' => 'Năm phải là số nguyên.',
            'year.min' => 'Năm không hợp lệ.',
            'year.max' => 'Năm không hợp lệ.',
        ];
    }

    public function attributes(): array
    {
        return [
            'subject_type' => 'loại môn học',
            'price_per_credit' => 'giá mỗi tín chỉ',
            'is_active' => 'trạng thái',
            'year' => 'năm áp dụng',
        ];
    }
}
