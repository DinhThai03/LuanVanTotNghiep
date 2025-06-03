<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateExamScheduleRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có quyền thực hiện yêu cầu này không.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các quy tắc xác thực cho việc tạo lịch thi.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'exam_date' => 'required|date',
            'exam_time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:1',
            'is_active' => 'required|boolean',
            'semester_subject_id' => 'required|exists:semester_subjects,id',
        ];
    }

    /**
     * Thông báo lỗi tùy chỉnh.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'exam_date.required' => 'Ngày thi là bắt buộc.',
            'exam_date.date' => 'Ngày thi phải đúng định dạng ngày (YYYY-MM-DD).',

            'exam_time.required' => 'Giờ thi là bắt buộc.',
            'exam_time.date_format' => 'Giờ thi phải đúng định dạng giờ (HH:MM).',

            'duration.required' => 'Thời lượng là bắt buộc.',
            'duration.integer' => 'Thời lượng phải là số nguyên.',
            'duration.min' => 'Thời lượng phải lớn hơn 0 phút.',

            'is_active.required' => 'Trạng thái hoạt động là bắt buộc.',
            'is_active.boolean' => 'Trạng thái phải là true hoặc false.',

            'semester_subject_id.required' => 'Môn học học kỳ là bắt buộc.',
            'semester_subject_id.exists' => 'Môn học học kỳ không tồn tại.',
        ];
    }

    /**
     * Nhãn các trường để hiển thị thân thiện hơn.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'exam_date' => 'ngày thi',
            'exam_time' => 'giờ thi',
            'duration' => 'thời lượng',
            'is_active' => 'trạng thái hoạt động',
            'semester_subject_id' => 'môn học học kỳ',
        ];
    }
}
