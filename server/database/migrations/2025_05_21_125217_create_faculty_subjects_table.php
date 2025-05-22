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
        Schema::create('faculty_subjects', function (Blueprint $table) {
            $table->engine = 'InnoDB';
        
            $table->id();
            $table->integer('year')->notNullable();
            $table->unsignedBigInteger('subject_id')->notNullable();
            $table->unsignedBigInteger('faculty_id')->notNullable();
        
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreign('faculty_id')->references('id')->on('faculties')->onDelete('cascade');
        
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_subjects');
    }
};
