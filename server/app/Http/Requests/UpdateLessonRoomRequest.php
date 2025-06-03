<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lesson_id' => ['sometimes', 'integer', 'exists:lessons,id'],
            'room_id' => ['sometimes', 'integer', 'exists:rooms,id'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'end_time' => ['sometimes', 'date_format:H:i', 'after:start_time'],
        ];
    }

    public function messages(): array
    {
        return [
            'lesson_id.exists' => 'Buổi học không tồn tại.',
            'room_id.exists' => 'Phòng học không tồn tại.',
            'start_time.date_format' => 'Giờ bắt đầu không đúng định dạng (H:i).',
            'end_time.date_format' => 'Giờ kết thúc không đúng định dạng (H:i).',
            'end_time.after' => 'Giờ kết thúc phải sau giờ bắt đầu.',
        ];
    }

    public function attributes(): array
    {
        return [
            'lesson_id' => 'buổi học',
            'room_id' => 'phòng học',
            'start_time' => 'giờ bắt đầu',
            'end_time' => 'giờ kết thúc',
        ];
    }
}
