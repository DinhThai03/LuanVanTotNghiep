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
        Schema::create('users', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('username', 50);
            $table->string('password', 100);
            $table->enum('role', ['admin', 'teacher', 'student', 'parent']);
            $table->string('email', 100);
            $table->date('date_of_birth');
            $table->string('full_name', 100);
            $table->string('address', 150);
            $table->string('phone', 15);
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
