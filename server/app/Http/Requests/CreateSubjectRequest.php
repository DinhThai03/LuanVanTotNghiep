<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateSubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:10', 'unique:subjects,code'],
            'name' => ['required', 'string', 'max:100'],
            'credit' => ['required', 'integer', 'min:1'],
            'tuition_credit' => ['required', 'integer', 'min:1'],
            'midterm_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'process_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'final_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'year' => ['required', 'integer', 'min:1', 'max:4'],
            'subject_type' => ['required', 'in:LT,TH'],
            'is_active' => ['sometimes'],
            'faculty_ids' => ['sometimes', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Vui lòng nhập mã môn học.',
            'code.string' => 'Mã môn học phải là chuỗi.',
            'code.size' => 'Mã môn học phải đúng 10 ký tự.',
            'code.unique' => 'Mã môn học đã tồn tại.',
            'name.required' => 'Tên môn học là bắt buộc.',
            'credit.required' => 'Số tín chỉ là bắt buộc.',
            'tuition_credit.required' => 'Tín chỉ học phí là bắt buộc.',
            'midterm_percent.required' => 'Tỷ lệ điểm giữa kỳ là bắt buộc.',
            'process_percent.required' => 'Tỷ lệ điểm quá trình là bắt buộc.',
            'final_percent.required' => 'Tỷ lệ điểm cuối kỳ là bắt buộc.',
            'year.required' => 'Năm là bắt buộc.',
            'year.integer' => 'Năm phải là số nguyên.',
            'year.min' => 'Năm phải lơn hơn hoặc bằng 1.',
            'year.max' => 'Năm không phải nhỏ hơn hoặc bằng 4.',
            'subject_type.required' => 'Loại môn học là bắt buộc.',
            'subject_type.in' => 'Loại môn học phải là LT hoặc TH.',
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
        ];
    }
}
