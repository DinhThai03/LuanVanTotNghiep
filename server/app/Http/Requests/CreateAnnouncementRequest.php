<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'target_type' => ['required', Rule::in(['all', 'students', 'teachers', 'custom'])],
            'target_classes' => ['nullable', 'array'],
            'target_classes.*' => ['integer', 'exists:classes,id'],
            'file_path' => ['nullable', 'file', 'mimes:pdf,docx,ppt,pptx'],
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
            'target_type.required' => 'Đối tượng không được để trống.',
            'target_type.in' => 'Đối tượng không hợp lệ.',
            'target_classes.array' => 'Danh sách lớp không hợp lệ.',
            'target_classes.*.integer' => 'Mỗi lớp phải là một số nguyên.',
            'target_classes.*.exists' => 'Một trong các lớp không tồn tại.',
            'file_path.file' => 'Tệp tải lên không hợp lệ.',
            'file_path.mimes' => 'Tệp phải là PDF, DOCX, PPT hoặc PPTX.',
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'tiêu đề',
            'content' => 'nội dung',
            'date' => 'ngày',
            'target_type' => 'đối tượng',
            'target_classes' => 'lớp áp dụng',
            'file_path' => 'tệp đính kèm',
        ];
    }
}
