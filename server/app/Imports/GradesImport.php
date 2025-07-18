<?php

namespace App\Imports;

use App\Models\Grade;
use App\Models\Registration;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;

class GradesImport implements ToCollection, WithHeadingRow
{
    public array $errors = [];

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            $rowArray = $row->toArray();

            // ⚠️ Fix: Convert empty strings to null to avoid SQL decimal errors
            $scoreFields = ['diem_qua_trinh', 'diem_giua_ky', 'diem_cuoi_ky'];
            foreach ($scoreFields as $field) {
                if (isset($rowArray[$field]) && $rowArray[$field] === '') {
                    $rowArray[$field] = null;
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

            $registration = Registration::where('lesson_id', $row['lesson_id'])
                ->where('student_code', $row['ma_sinh_vien'])
                ->first();

            if (!$registration) {
                $this->errors[] = [
                    'row' => $index + 2,
                    'data' => $rowArray,
                    'errors' => [
                        'registration' => ['Không tìm thấy bản ghi đăng ký cho lesson_id và mã sinh viên này.']
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
            } catch (\Throwable $e) {
                $this->errors[] = [
                    'row' => $index + 2,
                    'data' => $rowArray,
                    'errors' => ['exception' => [$e->getMessage()]],
                ];
            }
        }
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
