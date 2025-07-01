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
        Schema::create('students', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->char('code', 10)->primary();
            $table->string('place_of_birth', 150);

            $table->enum('status', ['studying', 'paused', 'graduated'])->default('studying');

            $table->unsignedBigInteger('class_id')->notNullable();
            $table->unsignedBigInteger('user_id')->unique()->notNullable();

            $table->foreign('class_id')->references('id')->on('school_classes');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
