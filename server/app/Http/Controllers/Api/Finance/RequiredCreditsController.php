<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Models\RequiredCredit;
use Illuminate\Http\Request;

class RequiredCreditsController extends Controller
{
    public function index(Request $request)
    {
        $query = RequiredCredit::with(['faculty', 'cohort']);

        if ($request->has('cohort_id'))
            $query->where('cohort_id', $request->get('cohort_id'));

        $data = $query->get();

        return response()->json($data);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'cohort_id' => 'required|exists:cohorts,id',
            'faculties' => 'required|array|min:1',
            'faculties.*.faculty_id' => 'required|exists:faculties,id',
            'faculties.*.required_credit' => 'required|integer|min:0',
        ]);

        $cohortId = $validated['cohort_id'];
        $facultiesData = $validated['faculties'];

        $results = [];

        foreach ($facultiesData as $item) {
            $record = RequiredCredit::updateOrCreate(
                [
                    'cohort_id' => $cohortId,
                    'faculty_id' => $item['faculty_id'],
                ],
                [
                    'required_credit' => $item['required_credit'],
                ]
            );

            $results[] = $record;
        }

        return response()->json([
            'message' => 'Cập nhật thành công.',
            'data' => $results,
        ], 200);
    }


    public function destroy($id)
    {
        $record = RequiredCredit::findOrFail($id);
        $record->delete();

        return response()->json(['message' => 'Đã xóa thành công.']);
    }
}
