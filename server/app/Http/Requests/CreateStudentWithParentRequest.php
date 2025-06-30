<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator as LaravelValidator;
use Carbon\Carbon;

class CreateStudentWithParentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            // Sinh viên (user)
            'student.username' => 'required|string|unique:users,username',
            'student.email' => 'required|email|unique:users,email',
            'student.password' => 'required|string|min:6',
            'student.first_name' => 'required|string',
            'student.last_name' => 'required|string',
            'student.sex' => 'required|boolean',
            'student.date_of_birth' => 'required|date',
            'student.address' => 'nullable|string',
            'student.phone' => 'nullable|string',
            'student.identity_number' => 'nullable|string|size:12',
            'student.issued_date' => 'nullable|date',
            'student.issued_place' => 'nullable|string',
            'student.religion' => 'nullable|string',
            'student.ethnicity' => 'nullable|string',

            // Sinh viên (model)
            'student.code' => 'required|string|size:10|unique:students,code',
            'student.class_id' => 'required|exists:school_classes,id',
            'student.place_of_birth' => 'nullable|string',
            'student.status' => 'nullable|string|in:studying,paused,graduated',
        ];

        $rules = array_merge($rules, [
            // Phụ huynh
            'parent.username' => 'required|string|unique:users,username',
            'parent.email' => 'required|email|unique:users,email',
            'parent.password' => 'required|string|min:6',
            'parent.first_name' => 'required|string',
            'parent.last_name' => 'required|string',
            'parent.sex' => 'nullable|boolean',
            'parent.date_of_birth' => 'nullable|date',
            'parent.address' => 'nullable|string',
            'parent.phone' => 'nullable|string',
            'parent.identity_number' => 'nullable|string|size:12',
            'parent.issued_date' => 'nullable|date',
            'parent.issued_place' => 'nullable|string',
            'parent.religion' => 'nullable|string',
            'parent.ethnicity' => 'nullable|string',
        ]);

        return $rules;
    }

    public function messages(): array
    {
        return [
            // Sinh viên
            'student.username.required' => 'Tên đăng nhập sinh viên là bắt buộc.',
            'student.username.unique' => 'Tên đăng nhập sinh viên đã tồn tại.',
            'student.email.required' => 'Email sinh viên là bắt buộc.',
            'student.email.unique' => 'Email sinh viên đã tồn tại.',
            'student.password.required' => 'Mật khẩu sinh viên là bắt buộc.',
            'student.password.min' => 'Mật khẩu sinh viên phải có ít nhất 6 ký tự.',
            'student.first_name.required' => 'Họ sinh viên là bắt buộc.',
            'student.last_name.required' => 'Tên sinh viên là bắt buộc.',
            'student.sex.required' => 'Giới tính sinh viên là bắt buộc.',
            'student.date_of_birth.required' => 'Ngày sinh sinh viên là bắt buộc.',
            'student.code.required' => 'Mã sinh viên là bắt buộc.',
            'student.code.unique' => 'Mã sinh viên đã tồn tại.',
            'student.code.size' => 'Mã sinh viên phải đúng 10 ký tự.',
            'student.class_id.required' => 'Lớp học là bắt buộc.',
            'student.class_id.exists' => 'Lớp học không tồn tại.',
            'student.status.in' => 'Trạng thái sinh viên không hợp lệ.',
            'student.identity_number.size' => 'CCCD sinh viên phải đúng 12 số.',

            // Phụ huynh
            'parent.username.required' => 'Tên đăng nhập phụ huynh là bắt buộc.',
            'parent.username.unique' => 'Tên đăng nhập phụ huynh đã tồn tại.',
            'parent.email.required' => 'Email phụ huynh là bắt buộc.',
            'parent.email.unique' => 'Email phụ huynh đã tồn tại.',
            'parent.password.required' => 'Mật khẩu phụ huynh là bắt buộc.',
            'parent.password.min' => 'Mật khẩu phụ huynh phải có ít nhất 6 ký tự.',
            'parent.first_name.required' => 'Họ phụ huynh là bắt buộc.',
            'parent.last_name.required' => 'Tên phụ huynh là bắt buộc.',
            'parent.identity_number.size' => 'CCCD phụ huynh phải đúng 12 số.',
        ];
    }

    public function attributes(): array
    {
        return [
            'student.username' => 'tên đăng nhập sinh viên',
            'student.email' => 'email sinh viên',
            'student.password' => 'mật khẩu sinh viên',
            'student.first_name' => 'họ sinh viên',
            'student.last_name' => 'tên sinh viên',
            'student.sex' => 'giới tính sinh viên',
            'student.date_of_birth' => 'ngày sinh sinh viên',
            'student.code' => 'mã sinh viên',
            'student.class_id' => 'lớp học',
            'student.status' => 'trạng thái sinh viên',
            'student.identity_number' => 'CCCD sinh viên',
            'parent.username' => 'tên đăng nhập phụ huynh',
            'parent.email' => 'email phụ huynh',
            'parent.password' => 'mật khẩu phụ huynh',
            'parent.first_name' => 'họ phụ huynh',
            'parent.last_name' => 'tên phụ huynh',
            'parent.identity_number' => 'CCCD phụ huynh',
        ];
    }

    public function withValidator(LaravelValidator $validator): void
    {
        $validator->after(function ($validator) {
            $studentDob = $this->input('student.date_of_birth');
            $parentDob = $this->input('parent.date_of_birth');

            // Kiểm tra sinh viên đủ 18 tuổi
            if ($studentDob && Carbon::parse($studentDob)->diffInYears(Carbon::now()) < 18) {
                $validator->errors()->add('student.date_of_birth', 'Sinh viên phải đủ ít nhất 18 tuổi.');
            }

            // (Tùy chọn) Kiểm tra phụ huynh đủ 18 tuổi nếu có ngày sinh
            if ($parentDob && Carbon::parse($parentDob)->diffInYears(Carbon::now()) < 18) {
                $validator->errors()->add('parent.date_of_birth', 'Phụ huynh phải đủ ít nhất 18 tuổi.');
            }

            // Kiểm tra CCCD không được trùng giữa sinh viên và phụ huynh
            $studentCCCD = $this->input('student.identity_number');
            $parentCCCD = $this->input('parent.identity_number');

            if ($studentCCCD && $parentCCCD && $studentCCCD === $parentCCCD) {
                $validator->errors()->add('parent.identity_number', 'Căn cước công dân của phụ huynh không được trùng với sinh viên.');
            }
        });
    }
}
