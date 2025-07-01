<?php

use App\Http\Controllers\Api\Academic\AcademicYearController;
use App\Http\Controllers\Api\Academic\ClassController;
use App\Http\Controllers\Api\Academic\CohortController;
use App\Http\Controllers\Api\Academic\FacultyController;
use App\Http\Controllers\Api\Academic\FacultySubjectController;
use App\Http\Controllers\Api\Academic\SemesterController;
use App\Http\Controllers\Api\Academic\SemesterSubjectController;
use App\Http\Controllers\Api\Academic\SubjectController;
use App\Http\Controllers\Api\Communication\AnnouncementController;
use App\Http\Controllers\Api\Communication\ClassAnnouncementController;
use App\Http\Controllers\Api\Examination\ExamClassRoomController;
use App\Http\Controllers\Api\Examination\ExamScheduleController;
use App\Http\Controllers\Api\Finance\CreditPriceController;
use App\Http\Controllers\Api\Finance\GradeController;
use App\Http\Controllers\Api\Finance\RegistrationController;
use App\Http\Controllers\Api\Finance\TuitionFeeController;
use App\Http\Controllers\Api\Profile\PasswordController;
use App\Http\Controllers\Api\Teaching\LessonController;
use App\Http\Controllers\Api\Teaching\RegistrationPeriodController;
use App\Http\Controllers\Api\Teaching\RoomController;
use App\Http\Controllers\Api\Teaching\TeacherSubjectController;
use App\Http\Controllers\Api\User\StudentController;
use App\Http\Controllers\Api\User\AdminController;
use App\Http\Controllers\Api\User\AuthController;
use App\Http\Controllers\Api\User\GuardianController;
use App\Http\Controllers\Api\User\TeacherController;
use App\Http\Controllers\Api\User\UserController;
use Illuminate\Support\Facades\Route;

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::post('change_password', [PasswordController::class, 'changeUserPassword']);
});

Route::middleware(['auth'])->group(function () {
    //============== USER ==============
    Route::get('users', [UserController::class, 'index']);
    Route::get('user/{id}', [UserController::class, 'show']);
    Route::post('user', [UserController::class, 'store']);
    Route::post('user/{id}', [UserController::class, 'update']);
    Route::delete('user/{id}', [UserController::class, 'destroy']);

    //============== ADMIN ==============
    Route::get('admins', [AdminController::class, 'index']);
    Route::get('admin/{user_id}', [AdminController::class, 'show']);
    Route::post('admin', [AdminController::class, 'store']);
    Route::post('admin/{user_id}', [AdminController::class, 'update']);
    Route::delete('admin/{user_id}', [AdminController::class, 'destroy']);

    //============== TEACHER ==============
    Route::get('teachers', [TeacherController::class, 'index']);
    Route::get('teacher/{code}', [TeacherController::class, 'show']);
    Route::post('teacher', [TeacherController::class, 'store']);
    Route::post('teacher/{code}', [TeacherController::class, 'update']);
    Route::delete('teacher/{code}', [TeacherController::class, 'destroy']);


    //============== STUDENT ==============
    Route::get('students', [StudentController::class, 'index']);
    Route::get('student/{code}', [StudentController::class, 'show']);
    Route::post('student', [StudentController::class, 'store']);
    Route::post('student/{code}', [StudentController::class, 'update']);
    Route::delete('student/{code}', [StudentController::class, 'destroy']);

    //============== PARENT ==============
    Route::get('guardians', [GuardianController::class, 'index']);
    Route::get('/student/{student_code}/guardian', [GuardianController::class, 'getParentByStudentCode']);
    Route::get('guardian/{id}', [GuardianController::class, 'show']);
    Route::post('guardian', [GuardianController::class, 'store']);
    Route::post('guardian/{id}', [GuardianController::class, 'update']);
    Route::delete('guardian/{id}', [GuardianController::class, 'destroy']);
    //============== COHORT ==============

    Route::get('/cohorts', [CohortController::class, 'index']);
    Route::post('/cohorts', [CohortController::class, 'store']);
    Route::get('/cohorts/{id}', [CohortController::class, 'show']);
    Route::post('/cohorts/{id}', [CohortController::class, 'update']);
    Route::delete('/cohorts/{id}', [CohortController::class, 'destroy']);
    Route::get('/cohorts/by-year/{year}', [CohortController::class, 'byYear']);
    Route::get('/cohorts/{id}/classes', [CohortController::class, 'classes']);
    Route::get('/cohorts/{id}/students', [CohortController::class, 'students']);

    //============== ACADEMIC YEAR ==============
    Route::get('academic_years', [AcademicYearController::class, 'index']);
    Route::get('/academic-years/with-semesters', [AcademicYearController::class, 'getAcademicYearsWithSemesters']);
    Route::get('academic_year/{id}', [AcademicYearController::class, 'show']);
    Route::post('academic_year', [AcademicYearController::class, 'store']);
    Route::post('academic_year/{id}', [AcademicYearController::class, 'update']);
    Route::delete('academic_year/{id}', [AcademicYearController::class, 'destroy']);

    //============== SEMESTER ==============
    Route::get('semesters', [SemesterController::class, 'index']);
    Route::get('semester/{id}', [SemesterController::class, 'show']);
    Route::post('semester', [SemesterController::class, 'store']);
    Route::post('semester/{id}', [SemesterController::class, 'update']);
    Route::delete('semester/{id}', [SemesterController::class, 'destroy']);

    //============== SUBJECT ==============
    Route::get('subjects', [SubjectController::class, 'index']);
    Route::get('subject/{id}', [SubjectController::class, 'show']);
    Route::post('subject', [SubjectController::class, 'store']);
    Route::post('subject/{id}', [SubjectController::class, 'update']);
    Route::delete('subject/{id}', [SubjectController::class, 'destroy']);

    //============== SEMESTER_SUBJECT ==============
    Route::get('semester_subjects', [SemesterSubjectController::class, 'index']);
    Route::get('semester/{id}/subjects', [SemesterSubjectController::class, 'getSubjectIdBySemester']);
    Route::post('/semester-subjects/update', [SemesterSubjectController::class, 'storeOrUpdateBySemester']);
    Route::get('semester_subject/{id}', [SemesterSubjectController::class, 'show']);
    Route::post('semester_subject', [SemesterSubjectController::class, 'store']);
    Route::post('semester_subject/{id}', [SemesterSubjectController::class, 'update']);
    Route::delete('semester_subject/{id}', [SemesterSubjectController::class, 'destroy']);


    //============== CLASS ==============
    Route::get('classed', [ClassController::class, 'index']);
    Route::get('class/{id}', [ClassController::class, 'show']);
    Route::post('class', [ClassController::class, 'store']);
    Route::post('class/{id}', [ClassController::class, 'update']);
    Route::delete('class/{id}', [ClassController::class, 'destroy']);

    //============== FACULTY ==============
    Route::get('facultys', [FacultyController::class, 'index']);
    Route::get('faculty/{id}', [FacultyController::class, 'show']);
    Route::post('faculty', [FacultyController::class, 'store']);
    Route::post('faculty/{id}', [FacultyController::class, 'update']);
    Route::delete('faculty/{id}', [FacultyController::class, 'destroy']);

    //============== FACULTY_SUBJECT ==============
    Route::get('faculty_subjects', [FacultySubjectController::class, 'index']);
    Route::get('/faculties/{facultyId}/all-subjects', [FacultySubjectController::class, 'getAllSubjectsWithFaculty']);
    Route::get('faculty_subject/{id}', [FacultySubjectController::class, 'show']);
    Route::post('faculty_subject', [FacultySubjectController::class, 'store']);
    Route::post('faculty_subject/{id}', [FacultySubjectController::class, 'update']);
    Route::delete('faculty_subject/{id}', [FacultySubjectController::class, 'destroy']);

    //============== LESSON ==============
    Route::get('lessons', [LessonController::class, 'index']);
    Route::get('lesson/{id}', [LessonController::class, 'show']);
    Route::post('lesson', [LessonController::class, 'store']);
    Route::post('lesson/{id}', [LessonController::class, 'update']);
    Route::delete('lesson/{id}', [LessonController::class, 'destroy']);

    //============== ROOM ==============
    Route::get('rooms', [RoomController::class, 'index']);
    Route::get('room/{id}', [RoomController::class, 'show']);
    Route::post('room', [RoomController::class, 'store']);
    Route::post('room/{id}', [RoomController::class, 'update']);
    Route::delete('room/{id}', [RoomController::class, 'destroy']);

    //============== TEACHER_SUBJECT ==============
    Route::get('teacher_subjects', [TeacherSubjectController::class, 'index']);
    Route::get('semester/{id}/subjects-forlesson', [TeacherSubjectController::class, 'getSubjectForLesson']);
    Route::get('teacher_subject/{id}', [TeacherSubjectController::class, 'show']);
    Route::post('teacher_subject', [TeacherSubjectController::class, 'store']);
    Route::post('teacher_subject/{id}', [TeacherSubjectController::class, 'update']);
    Route::delete('teacher_subject/{id}', [TeacherSubjectController::class, 'destroy']);

    //============== ANNOUNCEMENT ==============
    Route::get('announcements', [AnnouncementController::class, 'index']);
    Route::get('announcement/{id}', [AnnouncementController::class, 'show']);
    Route::post('announcement', [AnnouncementController::class, 'store']);
    Route::post('announcement/{id}', [AnnouncementController::class, 'update']);
    Route::delete('announcement/{id}', [AnnouncementController::class, 'destroy']);

    //============== CLASS_ANNOUNCEMENT ==============
    Route::get('class_announcements', [ClassAnnouncementController::class, 'index']);
    Route::post('class_announcement', [ClassAnnouncementController::class, 'store']);
    Route::delete('class_announcement/{class_id}/{announcement_id}', [ClassAnnouncementController::class, 'destroy']);

    //============== EXAM SCHEDULE ==============
    Route::get('exam_schedules', [ExamScheduleController::class, 'index']);
    Route::get('exam_schedule/{id}', [ExamScheduleController::class, 'show']);
    Route::post('exam_schedule', [ExamScheduleController::class, 'store']);
    Route::post('exam_schedule/{id}', [ExamScheduleController::class, 'update']);
    Route::delete('exam_schedule/{id}', [ExamScheduleController::class, 'destroy']);

    //============== EXAM CLASSROOM ==============
    Route::get('exam_classrooms', [ExamClassRoomController::class, 'index']);
    Route::get('exam_classroom/{id}', [ExamClassRoomController::class, 'show']);
    Route::post('exam_classroom', [ExamClassRoomController::class, 'store']);
    Route::post('exam_classroom/{id}', [ExamClassRoomController::class, 'update']);
    Route::delete('exam_classroom/{id}', [ExamClassRoomController::class, 'destroy']);

    //============== Credit Price ==============
    Route::get('credit_prices', [CreditPriceController::class, 'index']);
    Route::get('credit_price/{id}', [CreditPriceController::class, 'show']);
    Route::post('credit_price', [CreditPriceController::class, 'store']);
    Route::post('credit_price/{id}', [CreditPriceController::class, 'update']);
    Route::delete('credit_price/{id}', [CreditPriceController::class, 'destroy']);

    //============== Grade ==============
    Route::get('grades', [GradeController::class, 'index']);
    Route::get('grade/{id}', [GradeController::class, 'show']);
    Route::post('grade', [GradeController::class, 'store']);
    Route::post('grade/{id}', [GradeController::class, 'update']);
    Route::delete('grade/{id}', [GradeController::class, 'destroy']);

    //============== Registration ==============
    Route::get('registrations', [RegistrationController::class, 'index']);
    Route::get('/student-registrations/approved', [RegistrationController::class, 'getApprovedRegistrationsByStudent']);
    Route::get('registration/{id}', [RegistrationController::class, 'show']);
    Route::post('registration', [RegistrationController::class, 'store']);
    Route::post('registration/{id}', [RegistrationController::class, 'update']);
    Route::delete('registration/{id}', [RegistrationController::class, 'destroy']);

    //============== Tuition Fee ==============
    Route::get('tuition_fees', [TuitionFeeController::class, 'index']);
    Route::get('tuition_fee/{id}', [TuitionFeeController::class, 'show']);
    Route::post('tuition_fee', [TuitionFeeController::class, 'store']);
    Route::post('tuition_fee/{id}', [TuitionFeeController::class, 'update']);
    Route::delete('tuition_fee/{id}', [TuitionFeeController::class, 'destroy']);

    //============== Registration Period ==============
    Route::get('registration_periods', [RegistrationPeriodController::class, 'index']);
    // Route::post('registration_periods', [RegistrationPeriodController::class, 'store']);
    Route::post('/registration-periods/bulk', [RegistrationPeriodController::class, 'storeBulk']);
    Route::put('registration_periods/{id}', [RegistrationPeriodController::class, 'update']);
    Route::delete('registration_periods/{id}', [RegistrationPeriodController::class, 'destroy']);
});
