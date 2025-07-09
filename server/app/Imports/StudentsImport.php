<?php

namespace App\Imports;

use App\Models\GuardianModel;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class StudentsImport implements ToCollection, WithHeadingRow
{
    public array $errors = [];
    public int $successCount = 0;

    public function collection(Collection $rows)
    {
        $rules = [
            // Sinh viên
            'ma_sinh_vien' => 'required|string|size:10|unique:students,code',
            'email_sv' => 'required|email|unique:users,email',
            'ten_dang_nhap_sv' => 'required|string|unique:users,username',
            'mat_khau_sv' => 'required|string|min:6',
            'ho_sv' => 'required|string',
            'ten_sv' => 'required|string',
            'gioi_tinh_sv' => 'required|boolean',
            'ngay_sinh_sv' => 'required|date',
            'noi_sinh' => 'required|string',
            'dia_chi_sv' => 'required|string',
            'so_dien_thoai_sv' => 'required|string|max:11',
            'so_cccd_sv' => 'required|string|unique:users,identity_number',
            'ngay_cap_sv' => 'required|date',
            'noi_cap_sv' => 'required|string',
            'dan_toc_sv' => 'required|string',
            'ton_giao_sv' => 'required|string',
            'ma_lop' => 'required|exists:school_classes,id',
            'trang_thai_sv' => ['required', Rule::in(['studying', 'graduated', 'dropped'])],

            // Phụ huynh
            'ten_dang_nhap_ph' => 'required|string|unique:users,username',
            'mat_khau_ph' => 'required|string|min:6',
            'email_ph' => 'required|email|unique:users,email',
            'ho_ph' => 'required|string',
            'ten_ph' => 'required|string',
            'gioi_tinh_ph' => 'required|boolean',
            'ngay_sinh_ph' => 'required|date',
            'dia_chi_ph' => 'required|string',
            'so_dien_thoai_ph' => 'required|string|max:11',
            'so_cccd_ph' => 'required|string|unique:users,identity_number',
            'ngay_cap_ph' => 'required|date',
            'noi_cap_ph' => 'required|string',
            'dan_toc_ph' => 'required|string',
            'ton_giao_ph' => 'required|string',
        ];

        $messages = [
            // Sinh viên
            'ma_sinh_vien.required' => 'Mã sinh viên là bắt buộc.',
            'ma_sinh_vien.size' => 'Mã sinh viên phải đúng :size ký tự.',
            'ma_sinh_vien.unique' => 'Mã sinh viên đã tồn tại.',

            'email_sv.required' => 'Email sinh viên là bắt buộc.',
            'email_sv.email' => 'Email sinh viên không đúng định dạng.',
            'email_sv.unique' => 'Email sinh viên đã tồn tại.',

            'ten_dang_nhap_sv.required' => 'Tên đăng nhập sinh viên là bắt buộc.',
            'ten_dang_nhap_sv.unique' => 'Tên đăng nhập sinh viên đã tồn tại.',

            'mat_khau_sv.required' => 'Mật khẩu sinh viên là bắt buộc.',
            'mat_khau_sv.min' => 'Mật khẩu sinh viên phải có ít nhất :min ký tự.',

            'ho_sv.required' => 'Họ sinh viên là bắt buộc.',
            'ten_sv.required' => 'Tên sinh viên là bắt buộc.',

            'gioi_tinh_sv.required' => 'Giới tính sinh viên là bắt buộc.',
            'gioi_tinh_sv.boolean' => 'Giới tính sinh viên phải là true/false.',

            'ngay_sinh_sv.required' => 'Ngày sinh sinh viên là bắt buộc.',
            'ngay_sinh_sv.date' => 'Ngày sinh sinh viên không đúng định dạng.',

            'noi_sinh.required' => 'Nơi sinh là bắt buộc.',
            'dia_chi_sv.required' => 'Địa chỉ sinh viên là bắt buộc.',
            'so_dien_thoai_sv.required' => 'SĐT sinh viên là bắt buộc.',
            'so_dien_thoai_sv.max' => 'SĐT sinh viên không vượt quá :max ký tự.',

            'so_cccd_sv.required' => 'CCCD sinh viên là bắt buộc.',
            'so_cccd_sv.unique' => 'CCCD sinh viên đã tồn tại.',

            'ngay_cap_sv.required' => 'Ngày cấp CCCD sinh viên là bắt buộc.',
            'ngay_cap_sv.date' => 'Ngày cấp CCCD sinh viên không đúng định dạng.',

            'noi_cap_sv.required' => 'Nơi cấp CCCD sinh viên là bắt buộc.',
            'dan_toc_sv.required' => 'Dân tộc sinh viên là bắt buộc.',
            'ton_giao_sv.required' => 'Tôn giáo sinh viên là bắt buộc.',
            'ma_lop.required' => 'Lớp là bắt buộc.',
            'ma_lop.exists' => 'Lớp không tồn tại.',
            'trang_thai_sv.required' => 'Trạng thái học tập là bắt buộc.',
            'trang_thai_sv.in' => 'Trạng thái học tập không hợp lệ.',

            // Phụ huynh
            'ten_dang_nhap_ph.required' => 'Tên đăng nhập phụ huynh là bắt buộc.',
            'ten_dang_nhap_ph.unique' => 'Tên đăng nhập phụ huynh đã tồn tại.',
            'mat_khau_ph.required' => 'Mật khẩu phụ huynh là bắt buộc.',
            'mat_khau_ph.min' => 'Mật khẩu phụ huynh phải có ít nhất :min ký tự.',
            'email_ph.required' => 'Email phụ huynh là bắt buộc.',
            'email_ph.email' => 'Email phụ huynh không đúng định dạng.',
            'email_ph.unique' => 'Email phụ huynh đã tồn tại.',
            'ho_ph.required' => 'Họ phụ huynh là bắt buộc.',
            'ten_ph.required' => 'Tên phụ huynh là bắt buộc.',
            'gioi_tinh_ph.required' => 'Giới tính phụ huynh là bắt buộc.',
            'gioi_tinh_ph.boolean' => 'Giới tính phụ huynh phải là true/false.',
            'ngay_sinh_ph.required' => 'Ngày sinh phụ huynh là bắt buộc.',
            'ngay_sinh_ph.date' => 'Ngày sinh phụ huynh không đúng định dạng.',
            'dia_chi_ph.required' => 'Địa chỉ phụ huynh là bắt buộc.',
            'so_dien_thoai_ph.required' => 'SĐT phụ huynh là bắt buộc.',
            'so_dien_thoai_ph.max' => 'SĐT phụ huynh không vượt quá :max ký tự.',
            'so_cccd_ph.required' => 'CCCD phụ huynh là bắt buộc.',
            'so_cccd_ph.unique' => 'CCCD phụ huynh đã tồn tại.',
            'ngay_cap_ph.required' => 'Ngày cấp CCCD phụ huynh là bắt buộc.',
            'ngay_cap_ph.date' => 'Ngày cấp CCCD phụ huynh không đúng định dạng.',
            'noi_cap_ph.required' => 'Nơi cấp CCCD phụ huynh là bắt buộc.',
            'dan_toc_ph.required' => 'Dân tộc phụ huynh là bắt buộc.',
            'ton_giao_ph.required' => 'Tôn giáo phụ huynh là bắt buộc.',
        ];

        foreach ($rows as $index => $row) {
            if (empty($row['ma_sinh_vien'])) continue;

            $rowArray = $row->toArray();
            $rowArray = array_map(function ($value) {
                return is_null($value) ? null : (string)$value;
            }, $rowArray);

            foreach (['ngay_sinh_sv', 'ngay_cap_sv', 'ngay_sinh_ph', 'ngay_cap_ph'] as $field) {
                if (!empty($rowArray[$field]) && is_numeric($rowArray[$field])) {
                    $rowArray[$field] = Date::excelToDateTimeObject($rowArray[$field])->format('Y-m-d');
                }
            }

            $validator = Validator::make($rowArray, $rules, $messages);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 2,
                    'data' => $rowArray,
                    'errors' => $validator->errors()->messages(),
                ];
                continue;
            }

            try {
                DB::beginTransaction();

                $studentUser = User::create([
                    'username' => $row['ten_dang_nhap_sv'],
                    'password' => Hash::make($row['mat_khau_sv']),
                    'first_name' => $row['ten_sv'],
                    'last_name' => $row['ho_sv'],
                    'email' => $row['email_sv'],
                    'sex' => $row['gioi_tinh_sv'],
                    'date_of_birth' => $row['ngay_sinh_sv'],
                    'address' => $row['dia_chi_sv'],
                    'phone' => $row['so_dien_thoai_sv'],
                    'identity_number' => $row['so_cccd_sv'],
                    'issued_date' => $row['ngay_cap_sv'],
                    'issued_place' => $row['noi_cap_sv'],
                    'ethnicity' => $row['dan_toc_sv'],
                    'religion' => $row['ton_giao_sv'],
                    'role' => 'student',
                ]);

                $student = Student::create([
                    'code' => $row['ma_sinh_vien'],
                    'user_id' => $studentUser->id,
                    'class_id' => $row['ma_lop'],
                    'place_of_birth' => $row['noi_sinh'],
                    'status' => $row['trang_thai_sv'],
                ]);

                $parentUser = User::create([
                    'username' => $row['ten_dang_nhap_ph'],
                    'password' => Hash::make($row['mat_khau_ph']),
                    'first_name' => $row['ten_ph'],
                    'last_name' => $row['ho_ph'],
                    'email' => $row['email_ph'],
                    'sex' => $row['gioi_tinh_ph'],
                    'date_of_birth' => $row['ngay_sinh_ph'],
                    'address' => $row['dia_chi_ph'],
                    'phone' => $row['so_dien_thoai_ph'],
                    'identity_number' => $row['so_cccd_ph'],
                    'issued_date' => $row['ngay_cap_ph'],
                    'issued_place' => $row['noi_cap_ph'],
                    'ethnicity' => $row['dan_toc_ph'],
                    'religion' => $row['ton_giao_ph'],
                    'role' => 'parent',
                ]);

                GuardianModel::create([
                    'user_id' => $parentUser->id,
                    'student_code' => $student->code,
                ]);

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
