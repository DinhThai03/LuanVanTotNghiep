<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateExamClassRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exam_schedule_id' => 'required|exists:exam_schedules,id',
            'room_id' => 'required|exists:rooms,id',
            'class_id' => 'required|exists:school_classes,id',
            'start_seat' => 'required|integer|min:1',
            'end_seat' => 'required|integer|gte:start_seat',
        ];
    }

    public function messages(): array
    {
        return [
            'exam_schedule_id.required' => 'Lịch thi là bắt buộc.',
            'exam_schedule_id.exists' => 'Lịch thi không tồn tại.',
            'room_id.required' => 'Phòng thi là bắt buộc.',
            'room_id.exists' => 'Phòng thi không tồn tại.',
            'class_id.required' => 'Lớp là bắt buộc.',
            'class_id.exists' => 'Lớp không tồn tại.',
            'start_seat.required' => 'Số ghế bắt đầu là bắt buộc.',
            'start_seat.integer' => 'Số ghế bắt đầu phải là số nguyên.',
            'start_seat.min' => 'Số ghế bắt đầu phải lớn hơn 0.',
            'end_seat.required' => 'Số ghế kết thúc là bắt buộc.',
            'end_seat.integer' => 'Số ghế kết thúc phải là số nguyên.',
            'end_seat.gte' => 'Số ghế kết thúc phải lớn hơn hoặc bằng số ghế bắt đầu.',
        ];
    }

    public function attributes(): array
    {
        return [
            'exam_schedule_id' => 'lịch thi',
            'room_id' => 'phòng thi',
            'class_id' => 'lớp học',
            'start_seat' => 'số ghế bắt đầu',
            'end_seat' => 'số ghế kết thúc',
        ];
    }
}
