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
        Schema::create('lesson_rooms', function (Blueprint $table) {
            $table->engine = 'InnoDB';
        
            $table->unsignedBigInteger('lesson_id');
            $table->unsignedBigInteger('room_id');
            $table->time('start_time')->notNullable();
            $table->time('end_time')->notNullable();
        
            $table->primary(['lesson_id', 'room_id']);
        
            $table->foreign('lesson_id')->references('id')->on('lessons')->onDelete('cascade');
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
        
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_rooms');
    }
};
