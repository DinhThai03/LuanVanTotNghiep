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
        Schema::create('school_classes', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->string('name', 100)->notNullable();
            $table->integer('student_count')->notNullable();
            $table->unsignedBigInteger('faculty_id')->notNullable();
            $table->unsignedBigInteger('cohort_id')->notNullable();

            $table->foreign('faculty_id')->references('id')->on('faculties');
            $table->foreign('cohort_id')->references('id')->on('cohorts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_classes');
    }
};
