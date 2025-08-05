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
        Schema::create('lessons', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->date('start_date')->notNullable();
            $table->date('end_date')->notNullable();
            $table->integer('day_of_week')->notNullable();
            $table->unsignedBigInteger('room_id');
            $table->time('start_time')->notNullable();
            $table->time('end_time')->notNullable();
            $table->boolean('is_active')->notNullable();
            $table->unsignedBigInteger('teacher_subject_id')->notNullable();
            $table->unsignedBigInteger('semester_id')->notNullable();
            $table->enum('grade_status', ['not_entered', 'pending', 'submitted'])->default('not_entered');
            $table->foreign('teacher_subject_id')->references('id')->on('teacher_subjects');
            $table->foreign('semester_id')->references('id')->on('semesters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
