<?php

namespace App\Imports;

use App\Models\Grade;
use App\Models\Lesson;
use App\Models\Registration;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;

class GradesImport implements ToCollection, WithHeadingRow
{

    protected ?int $expectedLessonId;
    public array $errors = [];

    public function __construct(?int $expectedLessonId = null)
    {
        $this->expectedLessonId = $expectedLessonId;
    }

    public function collection(Collection $rows)
    {
        $updatedLessonIds = [];

        foreach ($rows as $index => $row) {
            $rowArray = $row->toArray();

            foreach (['diem_qua_trinh', 'diem_giua_ky', 'diem_cuoi_ky'] as $field) {
                if (isset($rowArray[$field]) && $rowArray[$field] === '') {
                    $rowArray[$field] = null;
                }
            }

            // Nếu có truyền expectedLessonId → so sánh
            if ($this->expectedLessonId !== null) {
                if ((int)($rowArray['lesson_id'] ?? 0) !== $this->expectedLessonId) {
                    $this->errors[] = [
                        'row' => $index + 2,
                        'data' => $rowArray,
                        'errors' => [
                            'lesson_id' => ["lesson_id không khớp với yêu cầu ({$this->expectedLessonId})."]
                        ],
                    ];
                    continue;
                }
            }

            $validator = Validator::make($rowArray, [
                'lesson_id' => 'required|integer',
                'ma_sinh_vien' => 'required|string',
                'diem_qua_trinh' => 'nullable|numeric|min:0|max:10',
                'diem_giua_ky' => 'nullable|numeric|min:0|max:10',
                'diem_cuoi_ky' => 'nullable|numeric|min:0|max:10',
            ]);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 2,
                    'data' => $rowArray,
                    'errors' => $validator->errors()->messages(),
                ];
                continue;
            }

            $registration = Registration::where('lesson_id', $rowArray['lesson_id'])
                ->where('student_code', $rowArray['ma_sinh_vien'])
                ->first();

            if (!$registration) {
                $this->errors[] = [
                    'row' => $index + 2,
                    'data' => $rowArray,
                    'errors' => [
                        'registration' => ['Không tìm thấy đăng ký cho lesson_id và mã sinh viên.']
                    ],
                ];
                continue;
            }

            try {
                Grade::updateOrCreate(
                    ['registration_id' => $registration->id],
                    [
                        'process_score' => $rowArray['diem_qua_trinh'],
                        'midterm_score' => $rowArray['diem_giua_ky'],
                        'final_score' => $rowArray['diem_cuoi_ky'],
                    ]
                );

                $updatedLessonIds[] = $rowArray['lesson_id'];
            } catch (\Throwable $e) {
                $this->errors[] = [
                    'row' => $index + 2,
                    'data' => $rowArray,
                    'errors' => ['exception' => [$e->getMessage()]],
                ];
            }
        }

        if (!empty($updatedLessonIds)) {
            Lesson::whereIn('id', array_unique($updatedLessonIds))
                ->update(['grade_status' => 'pending']);
        }
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
