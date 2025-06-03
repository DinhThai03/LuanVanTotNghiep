<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string'],
            'date' => ['required', 'date'],
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

    public function attributes(): array
    {
        return [
            'title' => 'tiêu đề',
            'content' => 'nội dung',
            'date' => 'ngày',
        ];
    }
}
