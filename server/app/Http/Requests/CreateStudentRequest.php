<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'            => ['required', 'string', 'size:10', 'unique:students,code'],
            'class_id'        => ['required', 'integer', 'exists:school_classes,id'],
            'user_id'         => ['required', 'integer', 'exists:users,id', 'unique:students,user_id'],
            'place_of_birth'  => ['required', 'string', 'max:150'],
            'status'          => ['nullable', 'in:studying,paused,graduated'], // Thêm dòng này
        ];
    }

    public function messages(): array
    {
        return [
            'code.required'       => 'Mã sinh viên là bắt buộc.',
            'code.size'           => 'Mã sinh viên phải đúng 10 ký tự.',
            'code.unique'         => 'Mã sinh viên đã tồn tại.',
            'class_id.required'   => 'Lớp học là bắt buộc.',
            'class_id.exists'     => 'Lớp học không tồn tại.',
            'user_id.required'    => 'Tài khoản người dùng là bắt buộc.',
            'user_id.exists'      => 'Người dùng không tồn tại.',
            'user_id.unique'      => 'Người dùng này đã là sinh viên.',
            'place_of_birth.max'  => 'Nơi sinh không được vượt quá 150 ký tự.',
            'status.in'           => 'Trạng thái không hợp lệ (phải là: studying, paused hoặc graduated).',
        ];
    }

    public function attributes(): array
    {
        return [
            'code'            => 'mã sinh viên',
            'class_id'        => 'lớp học',
            'user_id'         => 'tài khoản người dùng',
            'place_of_birth'  => 'nơi sinh',
            'status'          => 'trạng thái sinh viên',
        ];
    }
}
