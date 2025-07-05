<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'target_type' => ['sometimes', Rule::in(['all', 'students', 'teachers', 'custom'])],
            'target_classes' => ['sometimes', 'array'],
            'target_classes.*' => ['integer', 'exists:school_classes,id'],
            'file_path' => ['sometimes', 'file', 'mimes:pdf,docx,ppt,pptx'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.max' => 'Tiêu đề không được vượt quá 100 ký tự.',
            'date.date' => 'Ngày thông báo không hợp lệ.',
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
