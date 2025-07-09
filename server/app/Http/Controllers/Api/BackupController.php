<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BackupController extends Controller
{

    public function backupNow()
    {
        Artisan::call('backup:run', ['--only-db' => true]); // hoặc bỏ --only-db để backup cả file

        return response()->json([
            'message' => 'Backup completed',
            'output' => Artisan::output()
        ]);
    }
}
