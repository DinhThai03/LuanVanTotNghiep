<?php

namespace App\Http\Controllers\Api\Examination;

use App\Http\Controllers\Api\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GraduationController extends Controller
{
    public function checkGraduation($code): JsonResponse
    {
        $student = Student::with([
            'user',
            'schoolClass.faculty',
            'schoolClass.cohort',
            'registrations.grade',
            'registrations.lesson.semester.academicYear',
            'registrations.lesson.teacherSubject.subject',
        ])->where('code', $code)->first();

        if (!$student) {
            return response()->json(['message' => 'Sinh viên không tồn tại.'], 404);
        }

        $canGraduate = $student->canGraduate();
        $graduationRank = $canGraduate ? $student->getGraduationRank() : null;

        $grouped = $student->registrations
            ->filter(fn($reg) => $reg->grade && $reg->lesson && $reg->lesson->semester && $reg->lesson->semester->academicYear)
            ->groupBy(fn($reg) => $reg->lesson->semester->academicYear->id);

        $yearlyGPA = [];

        foreach ($grouped as $academicYearId => $registrations) {
            $year = $registrations->first()->lesson->semester->academicYear;

            // Bỏ qua nếu có môn chưa có điểm
            $hasIncomplete = $registrations->contains(fn($reg) => is_null($reg->grade->final_score));
            if ($hasIncomplete) {
                continue;
            }

            $totalCredits = 0;
            $totalWeightedScore = 0;

            foreach ($registrations as $reg) {
                $grade = $reg->grade;
                $subject = optional($reg->lesson->teacherSubject->subject);
                $credit = intval($subject->credit ?? 0);
                $avgScore = $grade->average_score;

                if ($grade->result == 1 && $avgScore !== null) {
                    $totalCredits += $credit;
                    $totalWeightedScore += $avgScore * $credit;
                }
            }

            $gpa = $totalCredits > 0 ? round($totalWeightedScore / $totalCredits, 2) : null;

            $yearlyGPA[] = [
                'academic_year' => $year->start_year . ' - ' . $year->end_year,
                'total_credits' => $totalCredits,
                'gpa' => $gpa,
            ];
        }

        return response()->json([
            'student_code' => $student->code,
            'student_name' => $student->user->last_name . " " . $student->user->first_name ?? '',
            'faculty' => $student->schoolClass?->faculty?->name,
            'cohort' => $student->schoolClass?->cohort?->name,
            'can_graduate' => $canGraduate,
            'graduation_rank' => $graduationRank,
            'yearly_gpa' => $yearlyGPA,
        ]);
    }

    public function checkGraduationList(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'faculty_id' => 'required|exists:faculties,id',
            'cohort_id' => 'required|exists:cohorts,id',
        ]);

        $students = Student::with([
            'user',
            'schoolClass.faculty',
            'schoolClass.cohort',
            'registrations.grade',
            'registrations.lesson.semester.academicYear',
            'registrations.lesson.teacherSubject.subject',
        ])->whereHas('schoolClass', function ($query) use ($validated) {
            $query->where('faculty_id', $validated['faculty_id'])
                ->where('cohort_id', $validated['cohort_id']);
        })->get();

        $results = $students->map(function ($student) {
            $canGraduate = $student->canGraduate();
            $graduationRank = $canGraduate ? $student->getGraduationRank() : null;

            $grouped = $student->registrations
                ->filter(fn($reg) => $reg->grade && $reg->lesson && $reg->lesson->semester && $reg->lesson->semester->academicYear)
                ->groupBy(fn($reg) => $reg->lesson->semester->academicYear->id);

            $yearlyGPA = [];

            foreach ($grouped as $academicYearId => $registrations) {
                $year = $registrations->first()->lesson->semester->academicYear;

                // Bỏ qua nếu có môn chưa có điểm
                $hasIncomplete = $registrations->contains(fn($reg) => is_null($reg->grade->final_score));
                if ($hasIncomplete) {
                    continue;
                }

                $totalCredits = 0;
                $totalWeightedScore = 0;

                foreach ($registrations as $reg) {
                    $grade = $reg->grade;
                    $subject = optional($reg->lesson->teacherSubject->subject);
                    $credit = intval($subject->credit ?? 0);
                    $avgScore = $grade->average_score;

                    if ($grade->result == 1 && $avgScore !== null) {
                        $totalCredits += $credit;
                        $totalWeightedScore += $avgScore * $credit;
                    }
                }

                $gpa = $totalCredits > 0 ? round($totalWeightedScore / $totalCredits, 2) : null;

                $yearlyGPA[] = [
                    'academic_year' => $year->start_year . ' - ' . $year->end_year,
                    'total_credits' => $totalCredits,
                    'gpa' => $gpa,
                ];
            }

            return [
                'student_code' => $student->code,
                'student_name' => $student->user->last_name . ' ' . $student->user->first_name ?? '',
                'can_graduate' => $canGraduate,
                'graduation_rank' => $graduationRank,
                'yearly_gpa' => $yearlyGPA,
            ];
        });

        return response()->json($results);
    }
}
