<?php

namespace App\Http\Controllers\Api\Communication;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\AssignAnnouncementToClassRequest;
use App\Http\Requests\CreateClassAnnouncementRequest;
use App\Models\ClassAnnouncement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassAnnouncementController extends Controller
{
    public function store(CreateClassAnnouncementRequest $request)
    {
        $classIds = $request->input('class_ids');
        $announcementId = $request->input('announcement_id');

        foreach ($classIds as $classId) {
            DB::table('class_announcements')->updateOrInsert(
                ['class_id' => $classId, 'announcement_id' => $announcementId],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        return response()->json([
            'message' => 'Gán thông báo cho lớp học thành công.'
        ]);
    }

    public function index(Request $request)
    {
        $query = ClassAnnouncement::query()
            ->join('announcements', 'class_announcements.announcement_id', '=', 'announcements.id')
            ->with('class', 'announcement')
            ->orderBy('announcements.date', 'desc')
            ->select('class_announcements.*');

        if ($request->has('class_id')) {
            $query->where('class_announcements.class_id', $request->input('class_id'));
        }

        $classAnnouncements = $query->get();

        return response()->json($classAnnouncements);
    }


    public function destroy($class_id, $announcement_id)
    {
        $deleted = DB::table('class_announcements')
            ->where('class_id', $class_id)
            ->where('announcement_id', $announcement_id)
            ->delete();

        if ($deleted === 0) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin gán thông báo.'
            ], 404);
        }

        return response()->json([
            'message' => 'Đã hủy gán thông báo khỏi lớp học thành công.'
        ]);
    }
}
