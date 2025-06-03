<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:100'],
            'content' => ['sometimes', 'string'],
            'date' => ['sometimes', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề không được để trống.',
            'title.max' => 'Tiêu đề không được vượt quá 100 ký tự.',
            'content.required' => 'Nội dung không được để trống.',
            'date.required' => 'Ngày thông báo không được để trống.',
            'date.date' => 'Ngày thông báo không hợp lệ.',
        ];
    }
}
