<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamClassRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exam_schedule_id' => 'sometimes|exists:exam_schedules,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'class_id' => 'sometimes|exists:school_classes,id',
            'start_seat' => 'sometimes|integer|min:1',
            'end_seat' => 'sometimes|integer|gte:start_seat',
        ];
    }

    public function messages(): array
    {
        return [
            'exam_schedule_id.exists' => 'Lịch thi không tồn tại.',
            'room_id.exists' => 'Phòng thi không tồn tại.',
            'class_id.exists' => 'Lớp không tồn tại.',
            'start_seat.integer' => 'Số ghế bắt đầu phải là số nguyên.',
            'start_seat.min' => 'Số ghế bắt đầu phải lớn hơn 0.',
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
