<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // hoặc thêm logic kiểm tra quyền người dùng nếu cần
    }

    public function rules(): array
    {
        $rules = [
            'class_id' => ['sometimes', 'integer', 'exists:school_classes,id'],
            'announcement_id' => ['sometimes', 'integer', 'exists:announcements,id'],
        ];

        if ($this->isMethod('POST')) {
            $rules['class_id'][] = 'distinct';
            $rules['announcement_id'][] = 'distinct';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'class_id.integer' => 'ID lớp học không hợp lệ.',
            'class_id.exists' => 'Lớp học không tồn tại.',
            'class_id.distinct' => 'ID lớp học bị trùng lặp.',

            'announcement_id.integer' => 'ID thông báo không hợp lệ.',
            'announcement_id.exists' => 'Thông báo không tồn tại.',
            'announcement_id.distinct' => 'ID thông báo bị trùng lặp.',
        ];
    }

    public function attributes(): array
    {
        return [
            'class_id' => 'lớp học',
            'announcement_id' => 'thông báo',
        ];
    }
}
