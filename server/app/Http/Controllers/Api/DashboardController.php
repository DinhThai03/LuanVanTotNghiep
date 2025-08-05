<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use App\Models\AcademicYear;
use App\Models\GuardianModel;
use App\Models\User;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Lesson;
use App\Models\Registration;
use App\Models\Student;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $academic_year_id = $request->input('academic_year_id');
        $faculty_id = $request->input('faculty_id');

        $getCountByRole = fn($role) => [
            'male' => User::where('role', $role)->where('sex', true)->count(),
            'female' => User::where('role', $role)->where('sex', false)->count(),
        ];

        $getCountStudents = function ($academic_year_id, $faculty_id) {
            $baseQuery = Student::query();

            if ($academic_year_id) {
                $academicYear = AcademicYear::find($academic_year_id);
                if (!$academicYear) {
                    return ['male' => 0, 'female' => 0];
                }

                $startYear = $academicYear->start_year;
                $endYear = $academicYear->end_year;

                $baseQuery->whereHas('schoolClass.cohort', function ($query) use ($startYear, $endYear) {
                    $query->where('start_year', '<=', $endYear)
                        ->where('end_year', '>=', $startYear);
                });
            }

            if ($faculty_id) {
                $baseQuery->whereHas('schoolClass.faculty', function ($query) use ($faculty_id) {
                    $query->where('id', $faculty_id);
                });
            }

            return [
                'male' => (clone $baseQuery)->whereHas('user', fn($q) => $q->where('sex', true))->count(),
                'female' => (clone $baseQuery)->whereHas('user', fn($q) => $q->where('sex', false))->count(),
            ];
        };

        $getCountParents = function ($academic_year_id, $faculty_id) {
            $baseQuery = GuardianModel::query();

            // Join với Student để lọc theo cohort (niên khóa) hoặc faculty (khoa)
            $baseQuery->whereHas('student', function ($query) use ($academic_year_id, $faculty_id) {
                if ($academic_year_id) {
                    $academicYear = AcademicYear::find($academic_year_id);
                    if (!$academicYear) {
                        return ['male' => 0, 'female' => 0];
                    }

                    $startYear = $academicYear->start_year;
                    $endYear = $academicYear->end_year;

                    $query->whereHas('schoolClass.cohort', function ($q) use ($startYear, $endYear) {
                        $q->where('start_year', '<=', $endYear)
                            ->where('end_year', '>=', $startYear);
                    });
                }

                if ($faculty_id) {
                    $query->whereHas('schoolClass.faculty', function ($q) use ($faculty_id) {
                        $q->where('id', $faculty_id);
                    });
                }
            });

            return [
                'male' => (clone $baseQuery)->whereHas('user', fn($q) => $q->where('sex', true))->count(),
                'female' => (clone $baseQuery)->whereHas('user', fn($q) => $q->where('sex', false))->count(),
            ];
        };

        $getCountSubjects = function ($academic_year_id, $faculty_id) {
            $baseQuery = Subject::query();

            if ($academic_year_id) {
                $baseQuery->whereHas('semesterSubjects.semester.academicYear', function ($query) use ($academic_year_id) {
                    $query->where('academic_year_id', $academic_year_id);
                });
            }

            if ($faculty_id) {
                $baseQuery->whereHas('facultySubjects', function ($query) use ($faculty_id) {
                    $query->where('faculty_id', $faculty_id);
                });
            }

            return [
                $baseQuery->count(),
            ];
        };

        $getCountClasses = function ($academic_year_id, $faculty_id) {
            $baseQuery = SchoolClass::query();


            if ($academic_year_id) {
                $academicYear = AcademicYear::find($academic_year_id);
                if (!$academicYear) {
                    return [0];
                }

                $startYear = $academicYear->start_year;
                $endYear = $academicYear->end_year;

                $baseQuery->whereHas('cohort', function ($query) use ($startYear, $endYear) {
                    $query->where('start_year', '<=', $endYear)
                        ->where('end_year', '>=', $startYear);
                });
            }

            if ($faculty_id) {
                $baseQuery->whereHas('faculty', function ($query) use ($faculty_id) {
                    $query->where('id', $faculty_id);
                });
            }

            return [
                $baseQuery->count(),
            ];
        };

        $getCountLessons = function ($academic_year_id, $faculty_id) {
            $baseQuery = Lesson::query();

            if ($academic_year_id) {
                $baseQuery->whereHas('semester.academicYear', function ($query) use ($academic_year_id) {
                    $query->where('academic_year_id', $academic_year_id);
                });
            }

            if ($faculty_id) {
                $baseQuery->whereHas('teacherSubject.subject.facultySubjects', function ($query) use ($faculty_id) {
                    $query->where('faculty_id', $faculty_id);
                });
            }

            return [
                $baseQuery->count(),
            ];
        };

        $getCountRegistrations = function ($academic_year_id, $faculty_id) {
            $baseQuery = Registration::query();

            if ($academic_year_id) {
                $baseQuery->whereHas('lesson.semester.academicYear', function ($query) use ($academic_year_id) {
                    $query->where('academic_year_id', $academic_year_id);
                });
            }

            if ($faculty_id) {
                $baseQuery->whereHas('lesson.teacherSubject.subject.facultySubjects', function ($query) use ($faculty_id) {
                    $query->where('faculty_id', $faculty_id);
                });
            }

            return [
                $baseQuery->count(),
            ];
        };

        return response()->json([
            'users' => [
                'students' => $getCountStudents($academic_year_id, $faculty_id),
                'teachers' => $getCountByRole('teacher'),
                'parents' => $getCountParents($academic_year_id, $faculty_id),
                'admins' => $getCountByRole('admin'),
            ],
            'classes' => $getCountClasses($academic_year_id, $faculty_id),
            'subjects' => $getCountSubjects($academic_year_id, $faculty_id),
            'lessons' => $getCountLessons($academic_year_id, $faculty_id),
            'registrations' => $getCountRegistrations($academic_year_id, $faculty_id),
        ]);
    }
}
