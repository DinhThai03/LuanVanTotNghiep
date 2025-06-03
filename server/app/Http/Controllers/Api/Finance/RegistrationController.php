<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\CreateRegistrationRequest;
use App\Http\Requests\UpdateRegistrationRequest;
use App\Models\Registration;

class RegistrationController extends Controller
{
    public function index()
    {
        return response()->json(Registration::all());
    }

    public function store(CreateRegistrationRequest $request)
    {
        $registration = Registration::create($request->validated());

        return response()->json([
            'message' => 'Tạo đăng ký thành công.',
            'data' => $registration,
        ], 201);
    }

    public function show($id)
    {
        $registration = Registration::find($id);

        if (!$registration) {
            return response()->json(['message' => 'Không tìm thấy đăng ký.'], 404);
        }

        return response()->json($registration);
    }

    public function update(UpdateRegistrationRequest $request, $id)
    {
        $registration = Registration::find($id);

        if (!$registration) {
            return response()->json(['message' => 'Không tìm thấy đăng ký.'], 404);
        }


        $registration->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật đăng ký thành công.',
            'data' => $registration,
        ]);
    }

    public function destroy($id)
    {
        $registration = Registration::find($id);

        if (!$registration) {
            return response()->json(['message' => 'Không tìm thấy đăng ký.'], 404);
        }

        $registration->delete();

        return response()->json(['message' => 'Xóa đăng ký thành công.']);
    }
}
