<?php

namespace App\Customs\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class PasswordService
{

    protected function validateCurentPassword($curent_password)
    {
        if (!password_verify($curent_password, Auth::user()->password)) {
            return response()->json([
                'status' => 'failed',
                'message' => 'password did not match the current password'
            ])->send();
            exit;
        }
    }

    public function changePassword($data)
    {
        $this->validateCurentPassword($data['current_password']);
        $updatePassword = Auth::user()->update([
            'password' => Hash::make($data['password'])
        ]);
        if ($updatePassword) {
            return response()->json([
                'status' => 'success',
                'message' => 'password update successfully'
            ]);
        } else {
            return response()->json([
                'status' => 'failed',
                'message' => 'An error occured while updating password'
            ]);
        }
    }
}
