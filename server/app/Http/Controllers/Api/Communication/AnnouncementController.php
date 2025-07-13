<?php

namespace App\Http\Controllers\Api\Communication;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Mail\AnnouncementMail;
use App\Models\Announcement;
use App\Models\User;
use App\Notifications\AnnouncementNotification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Announcement::with('classes');

        if ($request->has('class_id')) {
            $query->whereHas('classes', function ($q) use ($request) {
                $q->where('class_id', $request->input('class_id'));
            });
        }

        $announcements = $query->orderBy('date', 'desc')->get();

        return response()->json($announcements);
    }

    public function store(CreateAnnouncementRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Xử lý file đính kèm nếu có
        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');
            $data['file_path'] = $file->store('announcements/files', 'public');
        }

        $announcement = Announcement::create($data);

        // Gán lớp nếu target_type là custom
        if ($data['target_type'] === 'custom' && !empty($data['target_classes'])) {
            $announcement->classes()->sync($data['target_classes']);
        }

        $announcement->load('classes');

        // Gửi mail dựa theo target_type
        $recipientEmails = [];

        switch ($announcement->target_type) {
            case 'all':
                $recipientEmails = User::pluck('email')->toArray();
                break;

            case 'teachers':
                $recipientEmails = User::where('role', 'teacher')->pluck('email')->toArray();
                break;

            case 'students':
                $recipientEmails = User::where('role', 'student')->pluck('email')->toArray();
                break;

            case 'custom':
                $recipientEmails = User::where('role', 'student')
                    ->whereHas('student.classroom', function ($query) use ($data) {
                        $query->whereIn('classrooms.id', $data['target_classes']);
                    })
                    ->pluck('email')
                    ->toArray();
                break;

            default:
                // Không gửi nếu target_type không hợp lệ
                break;
        }

        $users = User::whereIn('email', $recipientEmails)->get();
        foreach ($users as $user) {
            $user->notify(new AnnouncementNotification($announcement));
        }
        return response()->json([
            'message' => 'Tạo thông báo thành công.',
            'data' => $announcement,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $announcement = Announcement::with('classes')->find($id);

        if (!$announcement) {
            return response()->json(['message' => 'Không tìm thấy thông báo.'], 404);
        }

        return response()->json(['data' => $announcement]);
    }

    public function update(UpdateAnnouncementRequest $request, $id): JsonResponse
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json(['message' => 'Không tìm thấy thông báo.'], 404);
        }

        $data = $request->validated();

        // Xử lý file nếu upload mới
        if ($request->hasFile('file_path')) {
            // Xóa file cũ nếu có
            if ($announcement->file_path) {
                Storage::disk('public')->delete($announcement->file_path);
            }

            $file = $request->file('file_path');
            $data['file_path'] = $file->store('announcements/files', 'public');
        }

        $announcement->update($data);

        // Cập nhật lớp nếu target_type là custom
        if (isset($data['target_type']) && $data['target_type'] === 'custom') {
            $announcement->classes()->sync($data['target_classes'] ?? []);
        } else {
            $announcement->classes()->detach(); // nếu không phải custom thì xóa quan hệ lớp
        }

        $announcement->load('classes');

        return response()->json([
            'message' => 'Cập nhật thông báo thành công.',
            'data' => $announcement,
        ]);
    }

    public function destroy($id): JsonResponse
    {

        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json(['message' => 'Không tìm thấy thông báo.'], 404);
        }

        // Xóa file đính kèm nếu có
        if ($announcement->file_path) {
            Storage::disk('public')->delete($announcement->file_path);
        }

        $announcement->classes()->detach(); // xóa quan hệ lớp
        $announcement->delete();

        return response()->json(['message' => 'Xóa thông báo thành công.']);
    }

    public function filter(Request $request): JsonResponse
    {
        $target = $request->input('target'); // 'all', 'students', 'teachers'
        $query = Announcement::query()->with('classes');

        // Lọc theo ngày nếu có
        if ($request->has('from')) {
            $query->whereDate('date', '>=', Carbon::parse($request->input('from')));
        }

        if ($request->has('to')) {
            $query->whereDate('date', '<=', Carbon::parse($request->input('to')));
        }

        switch ($target) {
            case 'students':
                $classId = $request->input('class_id');

                $query->where(function ($q) use ($classId) {
                    $q->where('target_type', 'all')
                        ->orWhere('target_type', 'students');

                    if ($classId) {
                        $q->orWhere(function ($sub) use ($classId) {
                            $sub->where('target_type', 'custom')
                                ->whereHas('classes', function ($c) use ($classId) {
                                    $c->where('class_id', $classId);
                                });
                        });
                    }
                });
                break;

            case 'teachers':
                $query->whereIn('target_type', ['all', 'teachers']);
                break;

            case 'all':
            default:
                $query->where('target_type', 'all');
                break;
        }

        $announcements = $query->orderByDesc('date')->get();

        return response()->json([
            'message' => 'Lấy danh sách thông báo thành công.',
            'data' => $announcements,
        ]);
    }
}
