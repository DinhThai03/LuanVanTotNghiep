<?php

namespace App\Http\Controllers\Api\Academic;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;

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

        $subject = Subject::create(collect($validated)->except('faculty_ids')->toArray());

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
        $subject->update(collect($validated)->except('faculty_ids')->toArray());
        $subject->faculties()->sync($validated['faculty_ids'] ?? []);
        $subject->load('facultySubjects', 'facultySubjects.faculty');
        return response()->json([
            'message' => 'Cập nhật môn học thành công.',
            'data' => $subject->load('faculties'),
        ]);
    }


    public function destroy($id): JsonResponse
    {
        $subject = Subject::find($id);
        if (!$subject) {
            return response()->json(['message' => 'Không tìm thấy môn học.'], 404);
        }

        $subject->delete();

        return response()->json(['message' => 'Xóa môn học thành công.']);
    }
}
