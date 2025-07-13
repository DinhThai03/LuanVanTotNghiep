<?php

namespace App\Imports;

use App\Models\Subject;
use App\Models\FacultySubject;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Validation\Rule;

class SubjectsImport implements ToCollection, WithHeadingRow
{
    public array $errors = [];
    public int $successCount = 0;

    public function collection(Collection $rows)
    {
        $rules = [
            'ma_hoc_phan' => 'required|string|size:10|unique:subjects,code',
            'ten_hoc_phan' => 'required|string',
            'tin_chi' => 'required|integer|min:1',
            'tin_chi_hoc_phi' => 'required|integer|min:1',
            'phan_tram_qua_trinh' => 'required|integer|min:0|max:100',
            'phan_tram_giua_ki' => 'required|integer|min:0|max:100',
            'phan_tram_cuoi_ki' => 'required|integer|min:0|max:100',
            'phan_loai' => ['required', Rule::in(['LT', 'TH', 'DA', 'KL'])],
            'nam_hoc' => 'required|integer|min:1|max:4',
            'danh_sach_khoa' => 'nullable|string', // dạng "1,2,3"
        ];

        $messages = [
            'ma_hoc_phan.required' => 'Mã học phần là bắt buộc.',
            'ma_hoc_phan.string' => 'Mã học phần phải là chuỗi.',
            'ma_hoc_phan.size' => 'Mã học phần phải đúng 10 ký tự.',
            'ma_hoc_phan.unique' => 'Mã học phần đã tồn tại.',

            'ten_hoc_phan.required' => 'Tên học phần là bắt buộc.',
            'ten_hoc_phan.string' => 'Tên học phần phải là chuỗi.',

            'tin_chi.required' => 'Số tín chỉ là bắt buộc.',
            'tin_chi.integer' => 'Số tín chỉ phải là số nguyên.',
            'tin_chi.min' => 'Số tín chỉ tối thiểu là 1.',

            'tin_chi_hoc_phi.required' => 'Tín chỉ học phí là bắt buộc.',
            'tin_chi_hoc_phi.integer' => 'Tín chỉ học phí phải là số nguyên.',
            'tin_chi_hoc_phi.min' => 'Tín chỉ học phí tối thiểu là 1.',

            'phan_tram_qua_trinh.required' => 'Phần trăm quá trình là bắt buộc.',
            'phan_tram_qua_trinh.integer' => 'Phần trăm quá trình phải là số nguyên.',
            'phan_tram_qua_trinh.min' => 'Phần trăm quá trình không được nhỏ hơn 0.',
            'phan_tram_qua_trinh.max' => 'Phần trăm quá trình không được vượt quá 100.',

            'phan_tram_giua_ki.required' => 'Phần trăm giữa kỳ là bắt buộc.',
            'phan_tram_giua_ki.integer' => 'Phần trăm giữa kỳ phải là số nguyên.',
            'phan_tram_giua_ki.min' => 'Phần trăm giữa kỳ không được nhỏ hơn 0.',
            'phan_tram_giua_ki.max' => 'Phần trăm giữa kỳ không được vượt quá 100.',

            'phan_tram_cuoi_ki.required' => 'Phần trăm cuối kỳ là bắt buộc.',
            'phan_tram_cuoi_ki.integer' => 'Phần trăm cuối kỳ phải là số nguyên.',
            'phan_tram_cuoi_ki.min' => 'Phần trăm cuối kỳ không được nhỏ hơn 0.',
            'phan_tram_cuoi_ki.max' => 'Phần trăm cuối kỳ không được vượt quá 100.',

            'phan_loai.required' => 'Phân loại là bắt buộc.',
            'phan_loai.in' => 'Phân loại không hợp lệ. Chỉ chấp nhận: LT, TH, DA, KL.',

            'nam_hoc.required' => 'Năm học là bắt buộc.',
            'nam_hoc.integer' => 'Năm học phải là số nguyên.',
            'nam_hoc.min' => 'Năm học tối thiểu là 1.',
            'nam_hoc.max' => 'Năm học tối đa là 4.',

            'danh_sach_khoa.string' => 'Danh sách khoa phải là chuỗi (ví dụ: "1,2,3").',
        ];


        foreach ($rows as $index => $row) {
            if (empty($row['ma_hoc_phan'])) continue;

            $rowArray = $row->toArray();

            $validator = Validator::make($rowArray, $rules, $messages);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 2, // +2 vì có heading và bắt đầu từ 0
                    'data' => $rowArray,
                    'errors' => $validator->errors()->messages(),
                ];
                continue;
            }

            try {
                DB::beginTransaction();

                $subject = Subject::create([
                    'code' => $row['ma_hoc_phan'],
                    'name' => $row['ten_hoc_phan'],
                    'credit' => $row['tin_chi'],
                    'tuition_credit' => $row['tin_chi_hoc_phi'],
                    'process_percent' => $row['phan_tram_qua_trinh'],
                    'midterm_percent' => $row['phan_tram_giua_ki'],
                    'final_percent' => $row['phan_tram_cuoi_ki'],
                    'subject_type' => $row['phan_loai'],
                    'year' => $row['nam_hoc'],
                ]);

                if (!empty($row['danh_sach_khoa'])) {
                    $facultyIds = array_filter(array_map('trim', explode(',', $row['danh_sach_khoa'])));

                    foreach ($facultyIds as $facultyId) {
                        FacultySubject::create([
                            'subject_id' => $subject->id,
                            'faculty_id' => (int)$facultyId,
                        ]);
                    }
                }

                DB::commit();
                $this->successCount++;
            } catch (\Throwable $e) {
                DB::rollBack();
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

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }
}
