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
        Schema::create('class_announcements', function (Blueprint $table) {
            $table->engine = 'InnoDB';
        
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('announcement_id');
        
            $table->primary(['class_id', 'announcement_id']);
        
            $table->foreign('class_id')->references('id')->on('school_classes')->onDelete('cascade');
            $table->foreign('announcement_id')->references('id')->on('announcements')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_announcements');
    }
};
