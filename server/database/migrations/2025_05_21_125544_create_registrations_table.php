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
        Schema::create('registrations', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->enum('status', ['pending', 'approved', 'canceled', 'completed'])->notNullable();
            $table->char('student_code', 10)->notNullable();
            $table->unsignedBigInteger('lesson_id')->notNullable();

            $table->foreign('student_code')->references('code')->on('students');
            $table->foreign('lesson_id')->references('id')->on('lessons');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
