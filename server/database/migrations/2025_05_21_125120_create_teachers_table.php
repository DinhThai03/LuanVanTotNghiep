<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->engine = 'InnoDB';
        
            $table->char('code', 10)->primary(); // mã giáo viên, là khóa chính
            $table->unsignedBigInteger('user_id')->unique(); // khóa ngoại tới bảng users
            $table->timestamps();
        
            $table->foreign('user_id')->references('id')->on('users'); // ràng buộc khóa ngoại
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
