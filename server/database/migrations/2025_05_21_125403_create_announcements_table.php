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
        Schema::create('announcements', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->string('title', 100);
            $table->text('content');
            $table->date('date');

            // Thêm các cột mới cho form
            $table->enum('target_type', ['all', 'students', 'teachers', 'custom'])->default('all');
            $table->string('file_path')->nullable(); // đường dẫn file nếu có

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
