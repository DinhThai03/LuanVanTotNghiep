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
            $table->boolean('is_active')->notNullable();
            $table->unsignedBigInteger('teacher_subject_id')->notNullable();
        
            $table->foreign('teacher_subject_id')->references('id')->on('teacher_subjects')->onDelete('cascade');
        
            $table->timestamps();
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
