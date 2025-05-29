<?php

namespace App\Http\Controllers\Api\Profile;

use App\Customs\Services\PasswordService;
use App\Http\Requests\ChangePasswordRequest;

class PasswordController
{
    protected PasswordService $service;
    public function __construct(PasswordService $service)
    {
        $this->service = $service;
    }
    public function changeUserPassword(ChangePasswordRequest $request)
    {
        return $this->service->changePassword($request->validated());
    }
}
