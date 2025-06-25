<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTeacherRequest extends FormRequest
{
    /**
     * Xác thực quyền truy cập request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Quy tắc validate.
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:10', 'unique:teachers,code'],
            'status' => ['required', 'string'],
            'faculty_id' => ['required', 'integer', 'exists:faculties,id'],
            'subject_ids' => ['sometimes', 'array'],
        ];
    }

    /**
     * Thông báo lỗi tùy chỉnh.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Vui lòng nhập mã giáo viên.',
            'code.string' => 'Mã giáo viên phải là chuỗi.',
            'code.size' => 'Mã giáo viên phải đúng 10 ký tự.',
            'code.unique' => 'Mã giáo viên đã tồn tại.',

            'status.required' => 'Trạng thái là bắt buộc.',
            'status.string' => 'Trạng thái phải là chuỗi.',

            'faculty_id.required' => 'Vui lòng chọn khoa.',
            'faculty_id.integer' => 'ID khoa không hợp lệ.',
            'faculty_id.exists' => 'Khoa không tồn tại.',
            'subject_ids.array' => 'mã môn học phải là 1 mảng'
        ];
    }

    /**
     * Định nghĩa tên hiển thị cho các trường.
     */
    public function attributes(): array
    {
        return [
            'code' => 'mã giáo viên',
            'status' => 'trạng thái',
            'faculty_id' => 'khoa',
        ];
    }
}
