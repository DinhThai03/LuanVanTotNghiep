<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateFacultySubjectRequest;
use App\Http\Requests\UpdateFacultySubjectRequest;
use App\Models\FacultySubject;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;

class FacultySubjectController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => FacultySubject::with(['subject', 'faculty'])->get()]);
    }

    public function getAllSubjectsWithFaculty($facultyId)
    {
        $subjects = Subject::with(['faculties' => function ($query) {
            $query->select('faculties.id', 'name');
        }])
            ->whereHas('faculties', function ($query) use ($facultyId) {
                $query->where('faculties.id', $facultyId);
            })
            ->orWhereDoesntHave('faculties')
            ->get();

        return response()->json($subjects);
    }

    public function store(CreateFacultySubjectRequest $request): JsonResponse
    {
        $fs = FacultySubject::create($request->validated());

        return response()->json([
            'message' => 'Tạo liên kết khoa - môn học thành công.',
            'data' => $fs,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $fs = FacultySubject::with(['subject', 'faculty'])->find($id);
        if (!$fs) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        return response()->json(['data' => $fs]);
    }

    public function update(UpdateFacultySubjectRequest $request, $id): JsonResponse
    {
        $fs = FacultySubject::find($id);
        if (!$fs) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $fs->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thành công.',
            'data' => $fs,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $fs = FacultySubject::find($id);
        if (!$fs) {
            return response()->json(['message' => 'Không tìm thấy bản ghi.'], 404);
        }

        $fs->delete();

        return response()->json(['message' => 'Xóa thành công.']);
    }
}
