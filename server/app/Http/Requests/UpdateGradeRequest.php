<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'registration_id' => 'sometimes|exists:registrations,id|unique:grades,registration_id',
            'process_score' => 'nullable|numeric|min:0|max:10',
            'midterm_score' => 'nullable|numeric|min:0|max:10',
            'final_score' => 'nullable|numeric|min:0|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'registration_id.exists' => 'Mã đăng ký không tồn tại.',
            'registration_id.unique' => 'Điểm cho mã đăng ký này đã tồn tại.',

            'process_score.numeric' => 'Điểm quá trình phải là số.',
            'process_score.min' => 'Điểm quá trình tối thiểu là 0.',
            'process_score.max' => 'Điểm quá trình tối đa là 10.',

            'midterm_score.numeric' => 'Điểm giữa kỳ phải là số.',
            'midterm_score.min' => 'Điểm giữa kỳ tối thiểu là 0.',
            'midterm_score.max' => 'Điểm giữa kỳ tối đa là 10.',

            'final_score.numeric' => 'Điểm cuối kỳ phải là số.',
            'final_score.min' => 'Điểm cuối kỳ tối thiểu là 0.',
            'final_score.max' => 'Điểm cuối kỳ tối đa là 10.',
        ];
    }

    public function attributes(): array
    {
        return [
            'registration_id' => 'mã đăng ký',
            'process_score' => 'điểm quá trình',
            'midterm_score' => 'điểm giữa kỳ',
            'final_score' => 'điểm cuối kỳ',
        ];
    }
}
