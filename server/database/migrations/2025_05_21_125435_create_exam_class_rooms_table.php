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
        Schema::create('exam_class_rooms', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->unsignedBigInteger('exam_schedule_id')->notNullable();
            $table->unsignedBigInteger('room_id')->notNullable();
            $table->unsignedBigInteger('class_id')->notNullable();
            $table->integer('start_seat')->notNullable();
            $table->integer('end_seat')->notNullable();

            $table->foreign('exam_schedule_id')->references('id')->on('exam_schedules');
            $table->foreign('room_id')->references('id')->on('rooms');
            $table->foreign('class_id')->references('id')->on('school_classes');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_class_rooms');
    }
};
