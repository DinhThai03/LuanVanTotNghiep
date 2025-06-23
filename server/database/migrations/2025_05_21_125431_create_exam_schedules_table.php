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
        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->date('exam_date')->notNullable();
            $table->time('exam_time')->notNullable();
            $table->integer('duration')->notNullable();
            $table->boolean('is_active')->notNullable();
            $table->unsignedBigInteger('semester_subject_id')->notNullable();

            $table->foreign('semester_subject_id')->references('id')->on('semester_subjects');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_schedules');
    }
};
