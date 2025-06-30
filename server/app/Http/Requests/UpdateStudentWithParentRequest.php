<?php

namespace App\Http\Requests;

use App\Models\GuardianModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;
use Illuminate\Validation\Validator as LaravelValidator;
use Carbon\Carbon;

class UpdateStudentWithParentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentUserId = (int) Arr::get($this->input('student'), 'user_id');

        // Lấy parent.user_id từ DB thông qua student.code
        $studentCode = $this->input('student.code');
        $parentUserId = GuardianModel::where('student_code', $studentCode)->value('user_id');

        return [
            // Sinh viên (User)
            'student.username' => [
                'required',
                'string',
                Rule::unique('users', 'username')->ignore($studentUserId),
            ],
            'student.email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($studentUserId),
            ],
            'student.password' => 'nullable|string|min:6',
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

            // Sinh viên (Model)
            'student.code' => [
                'required',
                'string',
                'size:10',
                Rule::unique('students', 'code')->ignore($studentUserId, 'user_id')
            ],
            'student.class_id' => 'required|exists:school_classes,id',
            'student.place_of_birth' => 'nullable|string',
            'student.status' => 'nullable|string|in:studying,paused,graduated',

            // Phụ huynh (User)
            'parent.username' => [
                'required',
                'string',
                Rule::unique('users', 'username')->ignore($parentUserId),
            ],
            'parent.email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($parentUserId),
            ],
            'parent.password' => 'nullable|string|min:6',
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
        ];
    }

    public function withValidator(LaravelValidator $validator): void
    {
        $validator->after(function ($validator) {
            $studentDob = $this->input('student.date_of_birth');
            $parentDob = $this->input('parent.date_of_birth');

            // Kiểm tra sinh viên ≥ 18 tuổi
            if ($studentDob && Carbon::parse($studentDob)->diffInYears(Carbon::now()) < 18) {
                $validator->errors()->add('student.date_of_birth', 'Sinh viên phải đủ ít nhất 18 tuổi.');
            }

            // Kiểm tra phụ huynh ≥ 18 tuổi nếu có ngày sinh
            if ($parentDob && Carbon::parse($parentDob)->diffInYears(Carbon::now()) < 18) {
                $validator->errors()->add('parent.date_of_birth', 'Phụ huynh phải đủ ít nhất 18 tuổi.');
            }

            // Kiểm tra CCCD không được trùng nhau
            $studentCCCD = $this->input('student.identity_number');
            $parentCCCD = $this->input('parent.identity_number');

            if ($studentCCCD && $parentCCCD && $studentCCCD === $parentCCCD) {
                $validator->errors()->add('parent.identity_number', 'Căn cước công dân của phụ huynh không được trùng với sinh viên.');
            }
        });
    }
}
