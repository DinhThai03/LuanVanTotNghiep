<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $subjectId = $this->route('id');
        return [
            'code' => [
                'sometimes',
                'string',
                'size:10',
                Rule::unique('subjects', 'code')->ignore($subjectId),
            ],
            'name' => ['sometimes', 'string', 'max:100'],
            'credit' => ['sometimes', 'integer', 'min:1'],
            'tuition_credit' => ['sometimes', 'integer', 'min:1'],
            'midterm_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'process_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'final_percent' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'year' => ['sometimes', 'integer', 'min:1', 'max:4'],
            'subject_type' => ['sometimes', 'in:LT,TH'],
            'is_active' => ['sometimes'],
            'faculty_ids' => ['sometimes', 'array'],
            'file_path' => ['nullable', 'file', 'mimes:pdf,docx,doc,zip', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.string' => 'Mã môn học phải là chuỗi.',
            'code.size' => 'Mã môn học phải đúng 10 ký tự.',
            'code.unique' => 'Mã môn học đã tồn tại.',
            'subject_type.in' => 'Loại môn học phải là LT hoặc TH.',
            'year.integer' => 'Năm phải là số nguyên.',
            'year.min' => 'Năm không hợp lệ.',
            'year.max' => 'Năm không hợp lệ.',
            'file_path.file' => 'Tài liệu phải là một file.',
            'file_path.mimes' => 'Tài liệu phải có định dạng pdf, doc, docx hoặc zip.',
            'file_path.max' => 'Tài liệu không được vượt quá 10MB.',
        ];
    }

    public function attributes(): array
    {
        return [
            "code" => 'mã môn học',
            'name' => 'tên môn học',
            'credit' => 'tín chỉ',
            'tuition_credit' => 'tín chỉ học phí',
            'midterm_percent' => 'tỷ lệ giữa kỳ',
            'process_percent' => 'tỷ lệ quá trình',
            'final_percent' => 'tỷ lệ cuối kỳ',
            'subject_type' => 'loại môn học',
            'file_path' => 'tài liệu môn học',
        ];
    }
}
