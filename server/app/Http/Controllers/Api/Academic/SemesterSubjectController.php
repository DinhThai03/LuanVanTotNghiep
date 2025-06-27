<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\SemesterSubjectRequest;
use App\Models\SemesterSubject;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SemesterSubjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SemesterSubject::with([
            'subject.facultySubjects.faculty',
            'semester.academicYear'
        ]);

        if ($request->has('faculty_id')) {
            $facultyId = $request->input('faculty_id');
            $query->whereHas('subject.facultySubjects.faculty', function ($q) use ($facultyId) {
                $q->where('faculties.id', $facultyId);
            });
        }

        if ($request->has('semester_id')) {
            $semesterId = $request->input('semester_id');
            $query->where('semester_id', $semesterId);
        }

        $data = $query->get();

        return response()->json(['data' => $data]);
    }

    public function getSubjectIdBySemester(int $id): JsonResponse
    {
        $subjectIds = SemesterSubject::where('semester_id', $id)
            ->pluck('subject_id');

        return response()->json(['data' => $subjectIds]);
    }

    public function storeOrUpdateBySemester(Request $request): JsonResponse
    {
        $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'subject_ids' => 'required|array',
            'subject_ids.*' => 'integer|exists:subjects,id',
        ]);

        $semesterId = $request->input('semester_id');
        $newSubjectIds = $request->input('subject_ids');

        DB::beginTransaction();
        try {
            $existingSubjectIds = SemesterSubject::where('semester_id', $semesterId)
                ->pluck('subject_id')
                ->toArray();

            $subjectIdsToDelete = array_diff($existingSubjectIds, $newSubjectIds);

            $subjectIdsToAdd = array_diff($newSubjectIds, $existingSubjectIds);

            if (!empty($subjectIdsToDelete)) {
                SemesterSubject::where('semester_id', $semesterId)
                    ->whereIn('subject_id', $subjectIdsToDelete)
                    ->delete();
            }

            foreach ($subjectIdsToAdd as $subjectId) {
                SemesterSubject::create([
                    'semester_id' => $semesterId,
                    'subject_id' => $subjectId,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Cập nhật thành công'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }


    public function store(SemesterSubjectRequest $request): JsonResponse
    {
        $semesterSubject = SemesterSubject::create($request->validated());

        return response()->json([
            'message' => 'Thêm môn học cho học kỳ thành công.',
            'data' => $semesterSubject,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $semesterSubject = SemesterSubject::with(['subject', 'semester'])->find($id);
        if (!$semesterSubject) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        return response()->json(['data' => $semesterSubject]);
    }

    public function update(SemesterSubjectRequest $request, $id): JsonResponse
    {
        $semesterSubject = SemesterSubject::find($id);
        if (!$semesterSubject) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $semesterSubject->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thành công.',
            'data' => $semesterSubject,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $semesterSubject = SemesterSubject::find($id);
        if (!$semesterSubject) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $semesterSubject->delete();

        return response()->json(['message' => 'Xóa thành công.']);
    }
}
