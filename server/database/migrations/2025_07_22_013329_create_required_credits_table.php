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
        Schema::create('required_credits', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->unsignedBigInteger('cohort_id')->notNullable();
            $table->unsignedBigInteger('faculty_id')->notNullable();
            $table->unsignedInteger('required_credit');
            $table->unique(['faculty_id', 'cohort_id']);
            $table->foreign('cohort_id')->references('id')->on('cohorts');
            $table->foreign('faculty_id')->references('id')->on('faculties');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('required_credits');
    }
};
