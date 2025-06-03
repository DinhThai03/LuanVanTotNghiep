<?php

namespace App\Http\Controllers\Api\Examination;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateExamClassRoomRequest;
use App\Http\Requests\StoreExamClassRoomRequest;
use App\Http\Requests\UpdateExamClassRoomRequest;
use App\Models\ExamClassRoom;
use Illuminate\Http\Request;

class ExamClassRoomController extends Controller
{
    public function index()
    {
        return response()->json(ExamClassRoom::all());
    }

    public function store(CreateExamClassRoomRequest $request)
    {
        $examClassRoom = ExamClassRoom::create($request->validated());

        return response()->json([
            'message' => 'Tạo phòng thi cho lớp thành công.',
            'data' => $examClassRoom,
        ], 201);
    }

    public function show($id)
    {
        $examClassRoom = ExamClassRoom::find($id);

        if (!$examClassRoom) {
            return response()->json(['message' => 'Không tìm thấy dữ liệu.'], 404);
        }

        return response()->json($examClassRoom);
    }

    public function update(UpdateExamClassRoomRequest $request, $id)
    {
        $examClassRoom = ExamClassRoom::find($id);

        if (!$examClassRoom) {
            return response()->json(['message' => 'Không tìm thấy dữ liệu.'], 404);
        }

        $examClassRoom->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thành công.',
            'data' => $examClassRoom,
        ]);
    }

    public function destroy($id)
    {
        $examClassRoom = ExamClassRoom::find($id);

        if (!$examClassRoom) {
            return response()->json(['message' => 'Không tìm thấy dữ liệu.'], 404);
        }

        $examClassRoom->delete();

        return response()->json(['message' => 'Xóa thành công.']);
    }
}
