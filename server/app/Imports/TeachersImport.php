<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TeachersImport implements ToCollection, WithHeadingRow
{
    public array $errors = [];

    public function collection(Collection $rows)
    {
        $rules = [
            'ma_giao_vien' => 'required|string|max:10|unique:teachers,code',
            'ten_dang_nhap' => 'required|string|unique:users,username',
            'mat_khau' => 'required|string|min:6',
            'ho' => 'required|string',
            'ten' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'ngay_sinh' => 'required|date|string',
            'gioi_tinh' => 'required|boolean',
            'dia_chi' => 'required|string',
            'so_dien_thoai' => 'required|string|max:11',
            'so_cccd' => 'nullable|string|unique:users,identity_number',
            'ngay_cap' => 'nullable|date|string',
            'noi_cap' => 'nullable|string|max:100',
            'dan_toc' => 'nullable|string|max:50',
            'ton_giao' => 'nullable|string|max:50',
            'ma_khoa' => 'required|exists:faculties,id',
            'trang_thai' => ['required', Rule::in(['Probation', 'Official', 'Resigned'])],
            'trang_thai_hoat_dong' => 'required|boolean',
            'mon_hoc' => 'nullable|string',
        ];

        $messages = [
            'ma_giao_vien.required' => 'Vui lòng nhập mã giáo viên.',
            'ma_giao_vien.string' => 'Mã giáo viên phải là chuỗi.',
            'ma_giao_vien.max' => 'Mã giáo viên không được vượt quá 10 ký tự.',
            'ma_giao_vien.unique' => 'Mã giáo viên đã tồn tại.',

            'ten_dang_nhap.required' => 'Tên đăng nhập là bắt buộc.',
            'ten_dang_nhap.string' => 'Tên đăng nhập phải là chuỗi.',
            'ten_dang_nhap.unique' => 'Tên đăng nhập đã tồn tại.',

            'mat_khau.required' => 'Mật khẩu là bắt buộc.',
            'mat_khau.string' => 'Mật khẩu phải là chuỗi.',
            'mat_khau.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',

            'ho.required' => 'Họ là bắt buộc.',
            'ho.string' => 'Họ phải là chuỗi.',

            'ten.required' => 'Tên là bắt buộc.',
            'ten.string' => 'Tên phải là chuỗi.',

            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã tồn tại.',

            'ngay_sinh.required' => 'Ngày sinh là bắt buộc.',
            'ngay_sinh.date' => 'Ngày sinh không hợp lệ.',
            'ngay_sinh.string' => 'Ngày sinh phải là chuỗi ngày hợp lệ.',

            'gioi_tinh.required' => 'Giới tính là bắt buộc.',
            'gioi_tinh.boolean' => 'Giới tính không hợp lệ.',

            'dia_chi.required' => 'Địa chỉ là bắt buộc.',
            'dia_chi.string' => 'Địa chỉ phải là chuỗi.',

            'so_dien_thoai.required' => 'Số điện thoại là bắt buộc.',
            'so_dien_thoai.string' => 'Số điện thoại phải là chuỗi.',
            'so_dien_thoai.max' => 'Số điện thoại không được vượt quá 11 ký tự.',

            'so_cccd.string' => 'Số căn cước phải là chuỗi.',
            'so_cccd.unique' => 'Số căn cước đã tồn tại.',

            'ngay_cap.date' => 'Ngày cấp không hợp lệ.',
            'ngay_cap.string' => 'Ngày cấp phải là chuỗi ngày hợp lệ.',

            'noi_cap.string' => 'Nơi cấp phải là chuỗi.',
            'noi_cap.max' => 'Nơi cấp không được vượt quá 100 ký tự.',

            'dan_toc.string' => 'Dân tộc phải là chuỗi.',
            'dan_toc.max' => 'Dân tộc không được vượt quá 50 ký tự.',

            'ton_giao.string' => 'Tôn giáo phải là chuỗi.',
            'ton_giao.max' => 'Tôn giáo không được vượt quá 50 ký tự.',

            'ma_khoa.required' => 'Vui lòng chọn khoa.',
            'ma_khoa.exists' => 'Khoa không tồn tại.',

            'trang_thai.required' => 'Vui lòng chọn trạng thái.',
            'trang_thai.in' => 'Trạng thái không hợp lệ.',

            'trang_thai_hoat_dong.required' => 'Trạng thái hoạt động là bắt buộc.',
            'trang_thai_hoat_dong.boolean' => 'Trạng thái hoạt động không hợp lệ.',

            'mon_hoc.string' => 'Danh sách môn học phải là chuỗi (các ID phân cách bằng dấu phẩy).',
        ];

        foreach ($rows as $index => $row) {
            if (empty($row['ma_giao_vien'])) {
                continue;
            }

            $rowArray = $row->toArray();

            if (is_numeric($rowArray['ngay_sinh'])) {
                $rowArray['ngay_sinh'] = Date::excelToDateTimeObject($rowArray['ngay_sinh'])->format('Y-m-d');
            }

            if (!empty($rowArray['ngay_cap']) && is_numeric($rowArray['ngay_cap'])) {
                $rowArray['ngay_cap'] = Date::excelToDateTimeObject($rowArray['ngay_cap'])->format('Y-m-d');
            }

            $validator = Validator::make($rowArray, $rules, $messages);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 2, // +2 vì dòng đầu tiên là heading
                    'data' => $rowArray,
                    'errors' => $validator->errors()->messages(),
                ];
                continue;
            }

            try {
                $user = User::create([
                    'username' => $row['ten_dang_nhap'],
                    'password' => Hash::make($row['mat_khau']),
                    'last_name' => $row['ho'],
                    'first_name' => $row['ten'],
                    'email' => $row['email'],
                    'date_of_birth' => $row['ngay_sinh'],
                    'sex' => $row['gioi_tinh'],
                    'address' => $row['dia_chi'],
                    'phone' => $row['so_dien_thoai'],
                    'identity_number' => $row['so_cccd'] ?? null,
                    'issued_date' => $row['ngay_cap'] ?? null,
                    'issued_place' => $row['noi_cap'] ?? null,
                    'ethnicity' => $row['dan_toc'] ?? null,
                    'religion' => $row['ton_giao'] ?? null,
                    'is_active' => $row['trang_thai_hoat_dong'],
                    'role' => 'teacher',
                ]);

                $teacher = Teacher::create([
                    'code' => $row['ma_giao_vien'],
                    'user_id' => $user->id,
                    'faculty_id' => $row['ma_khoa'],
                    'status' => $row['trang_thai'],
                ]);

                if (!empty($row['mon_hoc'])) {
                    $subjectIds = explode(',', $row['mon_hoc']);
                    $teacher->subjects()->sync($subjectIds);
                }
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
