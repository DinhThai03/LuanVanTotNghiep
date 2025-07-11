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
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->boolean('sex')->default(1);
            $table->string('address', 150);
            $table->string('phone', 15);
            $table->string('identity_number', 20)->nullable();
            $table->date('issued_date')->nullable();
            $table->string('issued_place', 100)->nullable();
            $table->string('ethnicity', 50)->nullable();
            $table->string('religion', 50)->nullable();
            $table->boolean('is_active')->default(1);
            $table->rememberToken()->nullable();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
