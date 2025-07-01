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
        Schema::create('semester_subjects', function (Blueprint $table) {
            $table->engine = 'InnoDB';
        
            $table->id();
            $table->unsignedBigInteger('subject_id')->notNullable();
            $table->unsignedBigInteger('semester_id')->notNullable();
        
            $table->foreign('subject_id')->references('id')->on('subjects');
            $table->foreign('semester_id')->references('id')->on('semesters');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semester_subjects');
    }
};
