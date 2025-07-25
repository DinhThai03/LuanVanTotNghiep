<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Imports\SubjectsImport;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class SubjectController extends Controller
{
    public function index(): JsonResponse
    {
        $subjects = Subject::with('facultySubjects', 'facultySubjects.faculty')->get();
        return response()->json(['data' => $subjects]);
    }

    public function store(CreateSubjectRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Xử lý file nếu có
        $filePath = null;
        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');
            $filePath = $file->store('subjects/files', 'public');
            $validated['file_path'] = $filePath;
        }

        // Tạo subject, bao gồm đường dẫn file nếu có
        $subject = Subject::create($validated);

        // Liên kết khoa
        $subject->faculties()->sync($validated['faculty_ids'] ?? []);
        $subject->load('facultySubjects', 'facultySubjects.faculty');

        return response()->json([
            'message' => 'Tạo môn học thành công.',
            'data' => $subject->load('faculties'),
        ], 201);
    }



    public function show($id): JsonResponse
    {
        $subject = Subject::find($id);
        $subject->load('facultySubjects', 'facultySubjects.faculty');
        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học.'], 404);
        }

        return response()->json(['data' => $subject]);
    }

    public function update(UpdateSubjectRequest $request, $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validated();

        // Xử lý file nếu có
        if ($request->hasFile('file_path')) {
            // Xóa file cũ nếu có
            if ($subject->file_path && Storage::disk('public')->exists($subject->file_path)) {
                Storage::disk('public')->delete($subject->file_path);
            }

            // Lưu file mới
            $file = $request->file('file_path');
            $filePath = $file->store('subjects/files', 'public');
            $validated['file_path'] = $filePath;
        }

        // Cập nhật dữ liệu (trừ faculty_ids)
        $subject->update(collect($validated)->except('faculty_ids')->toArray());

        // Đồng bộ khoa
        $subject->faculties()->sync($validated['faculty_ids'] ?? []);
        $subject->refresh()->load('facultySubjects', 'facultySubjects.faculty');

        return response()->json([
            'message' => 'Cập nhật môn học thành công.',
            'data' => $subject,
        ]);
    }


    public function destroy($id): JsonResponse
    {
        $subject = Subject::find($id);
        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học.'], 404);
        }

        // Xóa file đính kèm nếu tồn tại
        if ($subject->file_path && Storage::disk('public')->exists($subject->file_path)) {
            Storage::disk('public')->delete($subject->file_path);
        }

        // Gỡ liên kết với các khoa
        $subject->faculties()->detach();

        // Xóa môn học
        $subject->delete();

        return response()->json(['message' => 'Xóa môn học thành công.']);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        $import = new SubjectsImport();

        try {
            DB::beginTransaction();

            Excel::import($import, $request->file('file'));

            DB::commit();

            $errors = $import->getErrors();

            if (!empty($errors)) {
                return response()->json([
                    'message' => 'Một số dòng không thể nhập.',
                    'errors' => $errors
                ], 422); // Trả về lỗi xác thực để hiển thị ở phía client
            }

            return response()->json([
                'message' => 'Nhập dữ liệu môn học thành công.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Lỗi khi nhập dữ liệu môn học.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
